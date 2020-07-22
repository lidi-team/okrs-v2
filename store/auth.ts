import { ActionContext, ActionTree, GetterTree, MutationTree } from 'vuex';
import { LoginDTO, RegisterDTO, UserInfo } from '@/constants/app.interface';
import AuthRepository from '@/repositories/AuthRepository';
import { getTokenCookies, removeTokenCookies, setTokenCookies } from '@/utils/cookies';

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
  updateProfile(context: ActionContext<S, R>, data: any);
  changePassword(context: ActionContext<S, R>, newPassword: string);
}

export const state = (): AuthState => ({
  token: getTokenCookies(),
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
  async register({ commit }, { email, password, fullName }: RegisterDTO): Promise<void> {
    await AuthRepository.register({ email, password, fullName });
  },
  async login({ commit }, { email, password }: LoginDTO): Promise<void> {
    const { data } = await AuthRepository.login({ email, password });
    commit(AuthMutation.SET_TOKEN, data.data.token);
    commit(AuthMutation.SET_USER, {
      name: data.data.user.name,
      role: data.data.user.role,
      gravatar: data.data.user.gravatar,
    });
    setTokenCookies(data.data.token);
  },
  async logout({ commit, state }) {
    if (state.token === '') {
      throw new Error(`Can't not logout: token is undifined`);
    }
    await AuthRepository.logout();
    removeTokenCookies();
    setTokenCookies('');
    commit(AuthMutation.SET_TOKEN, '');
    commit(AuthMutation.SET_USER, null);
  },
  changePassword({ commit }, data: any) {},
  updateProfile({ commit }, data: any) {},
};
