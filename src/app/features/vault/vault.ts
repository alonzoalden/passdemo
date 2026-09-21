import { Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Category } from '../../core/models/vault-entry';
import { VaultStore } from './data-access/vault-store';

@Component({
  selector: 'app-vault',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './vault.html',
  styleUrl: './vault.scss',
})
export class Vault {
  protected readonly store = inject(VaultStore);
  private readonly fb = inject(FormBuilder);
  protected readonly query = signal('');
  protected readonly category = signal<Category | 'All'>('All');
  protected readonly categories = ['All', 'Work', 'Personal'] as const;
  protected readonly adding = signal(false);
  protected readonly revealed = signal<string | null>(null);
  protected readonly message = signal('');
  protected readonly entries = computed(() => {
    const query = this.query().trim().toLowerCase();
    return this.store
      .entries()
      .filter(
        (entry) =>
          (this.category() === 'All' || entry.category === this.category()) &&
          [entry.name, entry.username, entry.website].some((value) =>
            value.toLowerCase().includes(query),
          ),
      );
  });
  protected readonly form = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.pattern(/\S/), Validators.maxLength(100)]],
    username: ['', [Validators.required, Validators.pattern(/\S/), Validators.maxLength(200)]],
    password: ['', [Validators.required, Validators.maxLength(1000)]],
    website: ['', Validators.maxLength(200)],
    category: this.fb.nonNullable.control<Category>('Personal'),
  });

  protected openForm(): void {
    this.adding.set(true);
    this.revealed.set(null);
    this.message.set('');
  }

  protected cancel(): void {
    this.adding.set(false);
    this.form.reset();
  }

  protected save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const entry = this.form.getRawValue();
    this.store.add({
      ...entry,
      name: entry.name.trim(),
      username: entry.username.trim(),
      website: entry.website.trim(),
    });
    this.query.set('');
    this.category.set('All');
    this.cancel();
    this.message.set(`${entry.name.trim()} added to your demo vault.`);
  }

  protected togglePassword(id: string): void {
    this.revealed.update((current) => (current === id ? null : id));
  }

  protected remove(id: string): void {
    this.store.remove(id);
    if (this.revealed() === id) this.revealed.set(null);
    this.message.set('Entry deleted from your demo vault.');
  }
}
