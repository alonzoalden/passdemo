export type Category = 'Work' | 'Personal';

export interface VaultEntry {
  id: string;
  name: string;
  username: string;
  password: string;
  website: string;
  category: Category;
}

export type NewVaultEntry = Omit<VaultEntry, 'id'>;
