import { ActionTree, GetterTree, MutationTree, ActionContext } from 'vuex';
import MeasureRepository from '@/repositories/MeasureRepository';
// import { SelectDropdownDTO } from '@/constants/DTO/common';

export interface MeasureState {
  measure: Array<any>;
}

export const state = (): MeasureState => ({
  measure: [],
});

export type RootState = ReturnType<typeof state>;

export const getters: GetterTree<RootState, RootState> = {
  measureUnits: (state) => state.measure,
};

export const mutations: MutationTree<RootState> = {
  setMeasure: (state, measureUnits: any) => (state.measure = measureUnits),
};

export interface MeasureUnitActions<S, R> extends ActionTree<S, R> {
  getMeasure(context: ActionContext<S, R>): Promise<Array<any>>;
  clearMeasure(context: ActionContext<S, R>): void;
}

export const actions: MeasureUnitActions<MeasureState, RootState> = {
  getMeasure({ commit, state }) {
    return new Promise((resolve, reject) => {
      try {
        if (state.measure.length !== 0) {
          resolve(state.measure);
        } else {
          MeasureRepository.get().then(({ data }) => {
            commit('setMeasure', data);
            resolve(data);
          });
        }
      } catch (error) {
        reject(error);
      }
    });
  },
  clearMeasure({ commit }) {
    commit('setMeasure', null);
  },
};
