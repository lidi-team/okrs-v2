import { ActionTree, GetterTree, MutationTree } from 'vuex';
import { CycleDTO } from '@/constants/DTO/cycle';

export enum CycleMutation {
  SET_ALL_CYCLE = 'setAllCycles',
  SET_CURRENT_CYCLE = 'setCurrentCycle',
  SET_TEMP_CYCLE = 'setTempCycle',
}
export interface AuthState {
  cycles: any[];
  cycleCurrent: CycleDTO;
  cycleTemp: any;
}

export interface CycleAction<S, R> extends ActionTree<S, R> {}

export const state = (): AuthState => ({
  cycles: [],
  cycleCurrent: {
    id: 0,
    name: '2020',
  },
  cycleTemp: null,
});

export type RootState = ReturnType<typeof state>;

export const getters: GetterTree<RootState, RootState> = {
  cycles: (state) => state.cycles,
  cycleCurrent: (state) => state.cycleCurrent,
  cycleTemp: (state) => state.cycleTemp,
};

export const mutations: MutationTree<RootState> = {
  [CycleMutation.SET_ALL_CYCLE]: (state, cycles: any) => (state.cycles = cycles),
  [CycleMutation.SET_CURRENT_CYCLE]: (state, cycle: any) => (state.cycleCurrent = cycle),
  [CycleMutation.SET_TEMP_CYCLE]: (state, cycleTemp: Number) => (state.cycleTemp = cycleTemp),
};

export const actions: CycleAction<AuthState, RootState> = {};
