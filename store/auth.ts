import { ActionContext, ActionTree, GetterTree, MutationTree } from 'vuex';
import { Message } from 'element-ui';
import { LoginDTO, RegisterDTO, UserInfo } from '@/constants/app.interface';
import AuthRepository from '@/repositories/AuthRepository';
import { getTokenCookie, removeTokenCookie, setTokenCookie } from '@/utils/cookies';

export enum AuthMutation {
  SET_TOKEN = 'setToken',
  SET_USER = 'setUser',
}
export interface AuthState {
  token: string;
  user: UserInfo | null;
}

export interface AuthActions<S, R> extends ActionTree<S, R> {
  logout(context: ActionContext<S, R>): Promise<void>;
  login(context: ActionContext<S, R>, credentials: LoginDTO): Promise<void>;
  register(context: ActionContext<S, R>, credentials: RegisterDTO): Promise<void>;
  updateProfile(context: ActionContext<S, R>, data: any): Promise<void>;
  changePassword(context: ActionContext<S, R>, newPassword: string): Promise<void>;
  clear(context: ActionContext<S, R>): void;
}

export const state = (): AuthState => ({
  token: getTokenCookie(),
  user: {
    name: '',
    role: null,
    gravatar: null,
  },
});

export type RootState = ReturnType<typeof state>;

export const getters: GetterTree<RootState, RootState> = {
  token: (state) => state.token,
  user: (state) => state.user,
};

export const mutations: MutationTree<RootState> = {
  [AuthMutation.SET_TOKEN]: (state, token: string) => (state.token = token),
  [AuthMutation.SET_USER]: (state, user: UserInfo) => (state.user = user),
};

export const actions: AuthActions<AuthState, RootState> = {
  async register({ commit }, credentials: RegisterDTO): Promise<void> {
    await AuthRepository.register(credentials);
  },
  async login({ commit }, { email, password }: LoginDTO): Promise<void> {
    try {
      const { data } = await AuthRepository.login({ email, password });
      commit(AuthMutation.SET_TOKEN, data.data.token);
      commit(AuthMutation.SET_USER, {
        name: data.data.user.name,
        role: data.data.user.role,
        gravatar: data.data.user.gravatar,
      });
      setTokenCookie(data.data.token);
    } catch (error) {
      if (error === 'Network Error') {
        Message.error('Xảy ra lỗi về kết nối');
      }
    }
  },
  async logout({ commit, state }) {
    if (state.token === '') {
      throw new Error(`Can't not logout: token is undifined`);
    }
    await AuthRepository.logout();
    removeTokenCookie();
    setTokenCookie('');
    commit(AuthMutation.SET_TOKEN, '');
    commit(AuthMutation.SET_USER, null);
  },
  async changePassword({ commit }, data: any) {},
  async updateProfile({ commit }, data: any) {},
  clear({ commit }) {
    commit(AuthMutation.SET_TOKEN, '');
    commit(AuthMutation.SET_USER, null);
    removeTokenCookie();
  },
};
