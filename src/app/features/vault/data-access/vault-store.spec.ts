import { TestBed } from '@angular/core/testing';
import { NewVaultEntry } from '../../../core/models/vault-entry';
import { VaultStore } from './vault-store';

const sample: NewVaultEntry = {
  name: 'Interview sample',
  username: 'demo@example.com',
  password: ' Fictional demo only! ',
  website: 'example.com',
  category: 'Work',
};

describe('VaultStore', () => {
  it('adds entries with unique identities without mutating prior state or input', () => {
    const store = TestBed.inject(VaultStore);
    const previous = store.entries();
    const original = { ...sample };

    store.add(sample);
    store.add(sample);

    expect(previous).toHaveLength(4);
    expect(store.entries()).toHaveLength(6);
    expect(store.entries().slice(2)).toEqual(previous);
    const ids = store.entries().map((entry) => entry.id);
    expect(new Set(ids).size).toBe(ids.length);
    expect(ids.every(Boolean)).toBe(true);
    expect(store.entries()[0]).toMatchObject(original);
    expect(sample).toEqual(original);
  });

  it('removes only the requested entry and leaves prior snapshots intact', () => {
    const store = TestBed.inject(VaultStore);
    const previous = store.entries();
    store.remove('2');

    expect(store.entries().map((entry) => entry.id)).toEqual(['1', '3', '4']);
    expect(previous).toHaveLength(4);
    store.remove('missing');
    expect(store.entries()).toEqual(previous.filter((entry) => entry.id !== '2'));
  });

  it('shares state within the application injector and resets in a new application', () => {
    const store = TestBed.inject(VaultStore);
    store.add(sample);
    expect(TestBed.inject(VaultStore)).toBe(store);
    expect(TestBed.inject(VaultStore).entries()).toHaveLength(5);

    TestBed.resetTestingModule();
    const freshStore = TestBed.inject(VaultStore);
    expect(freshStore).not.toBe(store);
    expect(freshStore.entries()).toHaveLength(4);
    expect(freshStore.entries().some((entry) => entry.name === sample.name)).toBe(false);
  });
});
