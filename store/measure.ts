import { ActionTree, GetterTree, MutationTree, ActionContext } from 'vuex';
import MeasureUnitRepository from '@/repositories/MeasureUnitRepository';
import { SelectDropdownDTO } from '@/constants/DTO/common';

export enum MeasureUnitMutation {
  SET_MEASURE_UNITS = 'setMeasureUnits',
}
export interface AuthState {
  measure: Array<SelectDropdownDTO>;
}

export const state = (): AuthState => ({
  measure: [],
});

export type RootState = ReturnType<typeof state>;

export const getters: GetterTree<RootState, RootState> = {
  measureUnits: (state) => state.measure,
};

export const mutations: MutationTree<RootState> = {
  [MeasureUnitMutation.SET_MEASURE_UNITS]: (state, measureUnits: any) => (state.measure = measureUnits),
};

export interface MeasureUnitActions<S, R> extends ActionTree<S, R> {
  setMeasureUnits(context: ActionContext<S, R>): Promise<void>;
  clearMeasureUnits(context: ActionContext<S, R>): void;
}

export const actions: MeasureUnitActions<AuthState, RootState> = {
  async setMeasureUnits({ commit }) {
    try {
      await MeasureUnitRepository.get({ page: 1, limit: 20 }).then(({ data }) => {
        commit(MeasureUnitMutation.SET_MEASURE_UNITS, Object.freeze(data.data.items));
      });
    } catch (error) {}
  },
  clearMeasureUnits({ commit }) {
    commit(MeasureUnitMutation.SET_MEASURE_UNITS, null);
  },
};
