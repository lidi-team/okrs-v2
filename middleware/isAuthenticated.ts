import { Middleware, Context } from '@nuxt/types';
import { getTokenCookie } from '@/utils/cookies';
import { AuthMutation } from '@/store/auth';
import UserRepository from '@/repositories/UserRepository';

const authenticatedMiddleware: Middleware = async ({ redirect, store }: Context, __: Function) => {
  // if (!store.getters) {
  const token = getTokenCookie();
  if (!token) {
    return redirect('/dang-nhap');
  } else {
    store.commit('auth/setToken', token);
    try {
      const { data } = await UserRepository.me();
      store.commit(AuthMutation.SET_USER, data.data.user);
    } catch (error) {
      store.dispatch('auth/clear');
      return redirect('/');
    }
    // }
  }
};

export default authenticatedMiddleware;
