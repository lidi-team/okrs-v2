import { Middleware } from '@nuxt/types';

const isAdminMiddleware: Middleware = ({ redirect, store }) => {
  if (!store.state.auth.user.roles.includes('ROLE_ADMIN')) {
    redirect('/');
  }
};

export default isAdminMiddleware;
