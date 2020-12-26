export default function ({ redirect, store }) {
  if (
    store.state.auth.user.roles.includes('ROLE_HR') &&
    store.state.auth.user.roles.includes('ROLE_ADMIN')
  ) {
    return redirect('/');
  }
}
