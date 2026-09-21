import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { NewVaultEntry, VaultEntry } from '../../../core/models/vault-entry';

interface VaultState {
  entries: readonly Readonly<VaultEntry>[];
}

// Fictional demo credentials only. This store deliberately does not persist secrets.
const DEMO_ENTRIES: VaultEntry[] = [
  {
    id: '1',
    name: 'GitHub',
    username: 'alex@example.com',
    password: 'Demo-Github-Only!',
    website: 'github.com',
    category: 'Work',
  },
  {
    id: '2',
    name: 'Figma',
    username: 'alex@example.com',
    password: 'Demo-Figma-Only!',
    website: 'figma.com',
    category: 'Work',
  },
  {
    id: '3',
    name: 'Notion',
    username: 'alex@example.com',
    password: 'Demo-Notion-Only!',
    website: 'notion.so',
    category: 'Personal',
  },
  {
    id: '4',
    name: 'Spotify',
    username: 'alex.demo',
    password: 'Demo-Spotify-Only!',
    website: 'spotify.com',
    category: 'Personal',
  },
];

export const VaultStore = signalStore(
  // Preserve the demo vault across component recreation/navigation until page refresh.
  { providedIn: 'root' },
  withState<VaultState>(() => ({ entries: DEMO_ENTRIES.map((entry) => ({ ...entry })) })),
  withMethods((store) => ({
    add(entry: NewVaultEntry): void {
      const addedEntry: VaultEntry = { ...entry, id: crypto.randomUUID() };
      patchState(store, ({ entries }) => ({ entries: [addedEntry, ...entries] }));
    },
    remove(id: string): void {
      patchState(store, ({ entries }) => ({ entries: entries.filter((entry) => entry.id !== id) }));
    },
  })),
);
