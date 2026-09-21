import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { routes } from './app.routes';
import { VaultStore } from './features/vault/data-access/vault-store';

describe('App routing', () => {
  it('keeps vault changes when the home link is activated without reloading the page', async () => {
    TestBed.configureTestingModule({ providers: [provideRouter(routes)] });
    const harness = await RouterTestingHarness.create('/');
    const store = TestBed.inject(VaultStore);
    store.add({
      name: 'Navigation sample',
      username: 'demo@example.com',
      password: 'Fictional demo only!',
      website: 'example.com',
      category: 'Personal',
    });
    store.remove('1');
    await harness.fixture.whenStable();

    const home = harness.routeNativeElement?.querySelector<HTMLAnchorElement>(
      '[aria-label="Pass Demo home"]',
    );
    if (!home) throw new Error('Missing home link');
    const click = new MouseEvent('click', { bubbles: true, cancelable: true, button: 0 });
    home.dispatchEvent(click);
    await harness.fixture.whenStable();

    expect(click.defaultPrevented).toBe(true);
    expect(harness.routeNativeElement?.querySelector('tbody')?.textContent).toContain(
      'Navigation sample',
    );
    expect(harness.routeNativeElement?.querySelector('tbody')?.textContent).not.toContain('GitHub');
  });

  it('opens the vault for an unknown route', async () => {
    TestBed.configureTestingModule({ providers: [provideRouter(routes)] });
    const harness = await RouterTestingHarness.create('/unknown');
    expect(harness.routeNativeElement?.querySelector('h1')?.textContent).toContain('Your vault');
  });
});
