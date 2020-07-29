import { Middleware } from '@nuxt/types';

const isAdminMiddleware: Middleware = ({ redirect, store }) => {
  try {
    const userRole = store.getters['auth/user'].role.name;
    if (userRole !== 'ADMIN') {
      redirect('/');
    }
  } catch (error) {}
};

export default isAdminMiddleware;
