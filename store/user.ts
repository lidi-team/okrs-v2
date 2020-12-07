import { ActionTree, GetterTree, MutationTree } from 'vuex';

export enum UserMutation {
  SET_TEMP_USER = 'setTempUser',
  SET_USERS = 'setUsers',
}
export interface UserState {
  tempUser: any;
  users: any[];
}

export interface UserActions<S, R> extends ActionTree<S, R> {}

export const state = (): UserState => ({
  tempUser: null,
  users: [],
});

export type RootState = ReturnType<typeof state>;

export const getters: GetterTree<RootState, RootState> = {
  tempUser: (state) => state.tempUser,
  users: (state) => state.users,
};

export const mutations: MutationTree<RootState> = {
  [UserMutation.SET_TEMP_USER]: (state, tempUser: number | null) =>
    (state.tempUser = tempUser),
  [UserMutation.SET_USERS]: (state, users: any[]) => (state.users = users),
};

export const actions: UserActions<UserState, RootState> = {};
