import { Middleware } from '@nuxt/types';

const isAdminMiddleware: Middleware = ({ redirect, store }) => {
  if (store.state.auth.user.role.name !== 'ADMIN') {
    redirect('/');
  }
};

export default isAdminMiddleware;
