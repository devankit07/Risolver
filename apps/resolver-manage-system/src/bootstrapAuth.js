import { hydrateAuth } from './store/authSlice.js'

/**
 * Hydrate Redux auth from storage.
 * Priority: manage_token (team members who logged in via management login page)
 *           resolver_token (admins/managers who logged in via the website)
 */
export function hydrateAuthFromStorage(store) {
  if (typeof localStorage === 'undefined') return
  try {
    const urlParams = new URLSearchParams(window.location.search);
    const tokenParam = urlParams.get('token');
    const userParamStr = urlParams.get('user');

    if (tokenParam && userParamStr) {
      const user = JSON.parse(decodeURIComponent(urlParams.get('user')));
      localStorage.setItem('resolver_token', tokenParam);
      localStorage.setItem('resolver_user', JSON.stringify(user));
      window.history.replaceState({}, document.title, window.location.pathname);
    }

    const manageRaw   = localStorage.getItem('manage_user')
    const manageToken = localStorage.getItem('manage_token')
    if (manageRaw && manageToken) {
      store.dispatch(hydrateAuth({ user: JSON.parse(manageRaw), token: manageToken }))
      return
    }
    // Fallback: admin/manager logged in via the website
    const resolverRaw   = localStorage.getItem('resolver_user')
    const resolverToken = localStorage.getItem('resolver_token')
    if (resolverRaw && resolverToken) {
      const user = JSON.parse(resolverRaw)
      // Only let website sessions in for admin / manager roles
      if (user?.role === 'admin' || user?.role === 'manager') {
        store.dispatch(hydrateAuth({ user, token: resolverToken }))
      }
    }
  } catch {
    /* ignore corrupt storage */
  }
}
