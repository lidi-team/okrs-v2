import { getTokenCookie } from '@/utils/cookies';
import { AuthMutation } from '@/store/auth';
import UserRepository from '@/repositories/UserRepository';

export default async function ({ redirect, store }) {
  const token = getTokenCookie();
  if (!token) {
    store.dispatch('auth/clear');
    return redirect('/dang-nhap');
  } else {
    store.commit('auth/setToken', token);
    if (store.state.auth.user === null) {
      try {
        const { data } = await UserRepository.me();
        store.commit(`auth/${AuthMutation.SET_USER}`, data.data);
      } catch (error) {
        store.dispatch('auth/clear');
        return redirect('/dang-nhap');
      }
    }
  }
}
