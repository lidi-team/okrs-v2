import { GetterTree, ActionTree, MutationTree, ActionContext } from 'vuex';
import { UserRole } from '@/constants/app.type';
import { getTokenCookies, removeTokenCookies, setTokenCookies } from '@/utils/cookies';

export interface AuthState {
  token: string | undefined;
  role?: UserRole;
}

export interface AuthActions<S, R> extends ActionTree<S, R> {
  resetToken(context: ActionContext<S, R>): void;
}

export const state = (): AuthState => ({
  token: undefined,
});

export type RootState = ReturnType<typeof state>;

export const getters: GetterTree<RootState, RootState> = {
  role: (state) => state.role,
  token: (state) => state.token,
};

export const mutations: MutationTree<RootState> = {
  setToken: (state) => (state.token = getTokenCookies()),
};

export const actions: AuthActions<AuthState, RootState> = {
  resetToken({ commit }) {
    removeTokenCookies();
    setTokenCookies('');
  },
};
