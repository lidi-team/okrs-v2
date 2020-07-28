export default function ({ redirect, store }) {
  if (store.state.auth.user.role.name !== 'HR' && store.state.auth.user.role.name !== 'ADMIN') {
    return redirect('/');
  }
}
