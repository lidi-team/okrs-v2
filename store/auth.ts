import { GetterTree, ActionTree, MutationTree, ActionContext } from 'vuex';
import axios, { AxiosResponse } from 'axios';
import { getTokenCookies, removeTokenCookies, setTokenCookies } from '@/utils/cookies';
import { LoginDTO, RegisterDTO, UserInfo, AuthResponse } from '@/constants/app.interface';
import AuthRepository from '@/repositories/AuthRepository';
import { authEnpoint } from '@/constants/app.constant';

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
    avatar: null,
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
    let token;
    try {
      // const { data } = await AuthRepository.login({ email, password });
      const { data } = await axios.create({ baseURL: process.env.asdasd }).post<AuthResponse>(authEnpoint.login, { email, password });
      token = data.token;
    } catch (error) {
      console.log(error);
    }
    commit(AuthMutation.SET_TOKEN, token);
    setTokenCookies(token);
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
