import { ActionContext, ActionTree, GetterTree, MutationTree } from 'vuex';
import { notifyErrorLogin } from '@/constants/app.notify';
import { LoginDTO } from '@/constants/DTO/auth';
import AuthRepository from '@/repositories/AuthRepository';
import { removeTokenCookie, setTokenCookie } from '@/utils/cookies';

export enum AuthMutation {
  SET_TOKEN = 'setToken',
  SET_USER = 'setUser',
  SET_AVATAR = 'setUserAvatar',
}
export interface AuthState {
  token: any;
  user: any;
}

export interface AuthActions<S, R> extends ActionTree<S, R> {
  logout(): any;
  login(context: ActionContext<S, R>, credentials: LoginDTO): Promise<any>;
  clear(context: ActionContext<S, R>): void;
}

export const state = (): AuthState => ({
  token: null,
  user: null,
});

export type RootState = ReturnType<typeof state>;

export const getters: GetterTree<RootState, RootState> = {
  token: (state) => state.token,
  user: (state) => state.user,
  roles: (state) => state.user.roles,
};

export const mutations: MutationTree<RootState> = {
  [AuthMutation.SET_TOKEN]: (state, token: string) => (state.token = token),
  [AuthMutation.SET_USER]: (state, user: any) => (state.user = user),
  [AuthMutation.SET_AVATAR]: (state, url: string) =>
    (state.user = {
      ...state.user,
      avatarUrl: url,
      updateAvatarKey: Math.floor(Math.random() * 100001),
    }),
};

export const actions: AuthActions<AuthState, RootState> = {
  async login({ commit }, { email, password }: LoginDTO) {
    try {
      const { data } = await AuthRepository.login({ email, password });
      commit(AuthMutation.SET_TOKEN, data.jwtToken);
      setTokenCookie(data.jwtToken);
      return data.user;
    } catch (error) {
      notifyErrorLogin(error);
      return false;
    }
  },

  logout() {
    removeTokenCookie();
  },

  clear({ commit }) {
    commit(AuthMutation.SET_TOKEN, '');
    commit(AuthMutation.SET_USER, null);
    removeTokenCookie();
  },
};
