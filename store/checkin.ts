import { ActionTree, GetterTree, MutationTree } from 'vuex';

export enum CheckinMutation {
  SET_FLAG = 'setFlag',
}

export interface CheckinState {
  flag: Boolean;
}

export interface CheckinAction<S, R> extends ActionTree<S, R> {}

export const state = (): CheckinState => ({
  flag: false,
});

export type RootState = ReturnType<typeof state>;

export const getters: GetterTree<RootState, RootState> = {
  flag: (state) => state.flag,
};

export const mutations: MutationTree<RootState> = {
  [CheckinMutation.SET_FLAG]: (state) => (state.flag = !state.flag),
};

export const actions: CheckinAction<CheckinState, RootState> = {};
