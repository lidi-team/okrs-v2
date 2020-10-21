import { ActionTree, GetterTree, MutationTree } from 'vuex';

export enum CycleMutation {
  SET_ALL_CYCLE = 'setAllCycles',
  SET_CURRENT_CYCLE = 'setCurrentCycle',
  SET_TEMP_CYCLE = 'setTempCycle',
}
export interface AuthState {
  cycles: any[];
  cycleCurrent: any;
  cycleTemp: any;
}

export interface CycleAction<S, R> extends ActionTree<S, R> {}

export const state = (): AuthState => ({
  cycles: [],
  cycleCurrent: null,
  cycleTemp: null,
});

export type RootState = ReturnType<typeof state>;

export const getters: GetterTree<RootState, RootState> = {
  cycles: (state) => state.cycles,
  cycle: (state) => state.cycleCurrent,
  cycleTemp: (state) => state.cycleTemp,
};

export const mutations: MutationTree<RootState> = {
  [CycleMutation.SET_ALL_CYCLE]: (state, cycles: any) => (state.cycles = cycles),
  [CycleMutation.SET_CURRENT_CYCLE]: (state, cycle: any) => (state.cycleCurrent = cycle),
  [CycleMutation.SET_TEMP_CYCLE]: (state, cycleTemp: Number) => (state.cycleTemp = cycleTemp),
};

export const actions: CycleAction<AuthState, RootState> = {};
