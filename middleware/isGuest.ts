import { Middleware, Context } from '@nuxt/types';
import { getTokenCookie } from '@/utils/cookies';

const isGuestMiddleware: Middleware = ({ redirect, store }: Context, __: Function) => {
  const token = getTokenCookie();
  if (token) {
    return redirect('/');
  }
};

export default isGuestMiddleware;
