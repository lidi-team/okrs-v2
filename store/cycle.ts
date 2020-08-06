import { ActionTree, GetterTree, MutationTree } from 'vuex';

export enum CycleMutation {
  SET_CURRENT_CYCLE = 'setCurrentCycle',
}
export interface AuthState {
  cycle: any;
}

export interface CycleAction<S, R> extends ActionTree<S, R> {}

export const state = (): AuthState => ({
  cycle: null,
});

export type RootState = ReturnType<typeof state>;

export const getters: GetterTree<RootState, RootState> = {
  cycle: (state) => state.cycle,
};

export const mutations: MutationTree<RootState> = {
  [CycleMutation.SET_CURRENT_CYCLE]: (state, cycle: any) => (state.cycle = cycle),
};

export const actions: CycleAction<AuthState, RootState> = {};
