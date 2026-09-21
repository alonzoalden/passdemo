import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Vault } from './vault';
import { VaultStore } from './data-access/vault-store';

describe('Vault', () => {
  let fixture: ComponentFixture<Vault>;
  let element: HTMLElement;
  let store: InstanceType<typeof VaultStore>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Vault],
      providers: [provideRouter([])],
    }).compileComponents();
    fixture = TestBed.createComponent(Vault);
    element = fixture.nativeElement;
    store = TestBed.inject(VaultStore);
    await fixture.whenStable();
  });

  async function click(selector: string) {
    const button = element.querySelector<HTMLButtonElement>(selector);
    if (!button) throw new Error(`Missing button: ${selector}`);
    button.click();
    await fixture.whenStable();
  }

  async function fill(selector: string, value: string) {
    const input = element.querySelector<HTMLInputElement>(selector);
    if (!input) throw new Error(`Missing input: ${selector}`);
    input.value = value;
    input.dispatchEvent(new Event('input', { bubbles: true }));
    await fixture.whenStable();
  }

  it('masks passwords by default and reveals only one entry at a time', async () => {
    expect(element.textContent).not.toContain('Demo-Github-Only!');
    await click('[aria-label="Show password for GitHub"]');
    expect(element.textContent).toContain('Demo-Github-Only!');
    await click('[aria-label="Show password for Figma"]');
    expect(element.textContent).not.toContain('Demo-Github-Only!');
    expect(element.textContent).toContain('Demo-Figma-Only!');
    await click('[aria-label="Hide password for Figma"]');
    expect(element.textContent).not.toContain('Demo-Figma-Only!');
  });

  it('combines category and case-insensitive search without searching secrets', async () => {
    await fill('[aria-label="Search passwords"]', ' GITHUB ');
    expect(element.querySelectorAll('tbody tr')).toHaveLength(1);
    expect(element.querySelector('tbody')?.textContent).toContain('GitHub');
    await click('nav button:nth-child(3)');
    expect(element.querySelector('tbody')?.textContent).toContain('No matching passwords');
    await click('nav button:first-child');
    await fill('[aria-label="Search passwords"]', 'Demo-Github-Only!');
    expect(element.querySelector('tbody')?.textContent).toContain('No matching passwords');
  });

  it('validates required fields and adds a masked entry without trimming its password', async () => {
    await click('.heading button');
    await click('button[type="submit"]');
    expect(store.entries()).toHaveLength(4);
    expect(element.querySelector('[role="alert"]')).not.toBeNull();
    await fill('[formControlName="name"]', '   ');
    await fill('[formControlName="username"]', 'alex');
    await fill('[formControlName="password"]', ' Demo only! ');
    await click('button[type="submit"]');
    expect(store.entries()).toHaveLength(4);
    await fill('[formControlName="name"]', ' Interview ');
    await click('button[type="submit"]');
    expect(store.entries()).toHaveLength(5);
    expect(store.entries()[0]).toMatchObject({ name: 'Interview', password: ' Demo only! ' });
    expect(element.querySelector('tbody')?.textContent).toContain('Interview');
    expect(element.textContent).not.toContain(' Demo only! ');
    expect(element.querySelector('form')).toBeNull();
  });

  it('discards a cancelled draft and deletes the selected entry', async () => {
    await click('.heading button');
    await fill('[formControlName="name"]', 'Discard me');
    await click('.form-actions button[type="button"]');
    await click('.heading button');
    expect(element.querySelector<HTMLInputElement>('[formControlName="name"]')?.value).toBe('');
    await click('.form-actions button[type="button"]');
    await click('[aria-label="Delete GitHub"]');
    expect(store.entries()).toHaveLength(3);
    expect(element.querySelector('tbody')?.textContent).not.toContain('GitHub');
  });
});
