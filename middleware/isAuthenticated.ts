import { getTokenCookie } from '@/utils/cookies';
import { AuthMutation } from '@/store/auth';
import { CycleMutation } from '@/store/cycle';
import UserRepository from '@/repositories/UserRepository';
import CycleRepository from '@/repositories/CycleRepository';

export default async function ({ redirect, store }) {
  const token = getTokenCookie();
  if (!token) {
    store.dispatch('auth/clear');
    return redirect('/dang-nhap');
  } else {
    store.commit('auth/setToken', token);
    if (store.state.auth.user === null) {
      try {
        const [user, cycle] = await Promise.all([UserRepository.me(), CycleRepository.getCurrentCycle()]);
        store.commit(`cycle/${CycleMutation.SET_CURRENT_CYCLE}`, cycle.data.data);
        store.commit(`auth/${AuthMutation.SET_USER}`, user.data.data);
      } catch (error) {
        store.dispatch('auth/clear');
        return redirect('/dang-nhap');
      }
    }
  }
}
