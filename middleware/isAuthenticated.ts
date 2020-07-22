import { Middleware, Context } from '@nuxt/types';
import { AuthState } from '@/store/auth';

const authenticatedMiddleware: Middleware = ({ redirect, store }: Context, __: Function) => {
  const auth = store.state.auth as AuthState;
  if (!auth.token) {
    return redirect('/login');
  } else {
    return redirect('/dashboard');
  }
};

export default authenticatedMiddleware;
