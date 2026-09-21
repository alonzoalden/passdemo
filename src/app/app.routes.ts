import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    title: 'Your vault · Pass Demo',
    loadComponent: () => import('./features/vault/vault').then((m) => m.Vault),
  },
  { path: '**', redirectTo: '' },
];
