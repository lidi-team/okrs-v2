import { ActionTree, GetterTree, MutationTree } from 'vuex';

export enum MeasureUnitMutation {
  SET_MEASURE_UNITS = 'setMeasureUnits',
}
export interface AuthState {
  measureUnits: any;
}

export interface MeasureUnitActions<S, R> extends ActionTree<S, R> {}

export const state = (): AuthState => ({
  measureUnits: null,
});

export type RootState = ReturnType<typeof state>;

export const getters: GetterTree<RootState, RootState> = {
  measureUnits: (state) => state.measureUnits,
};

export const mutations: MutationTree<RootState> = {
  [MeasureUnitMutation.SET_MEASURE_UNITS]: (state, measureUnits: any) => (state.measureUnits = measureUnits),
};

export const actions: MeasureUnitActions<AuthState, RootState> = {};
