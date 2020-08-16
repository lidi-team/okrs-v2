import { ActionTree, GetterTree, MutationTree } from 'vuex';
import { HistoryRepository } from '@/repositories/CfrsRepository';

export enum CycleMutation {
  SET_CURRENT_CYCLE = 'setCurrentCycle',
  SET_TEMP_CYCLE = 'setTempCycle',
}
export interface AuthState {
  cycle: any;
  cycleTemp: Number;
}

export interface CycleAction<S, R> extends ActionTree<S, R> {}

export const state = (): AuthState => ({
  cycle: null,
  cycleTemp: -1,
});

export type RootState = ReturnType<typeof state>;

export const getters: GetterTree<RootState, RootState> = {
  cycle: (state) => state.cycle,
  cycleTemp: (state) => state.cycleTemp,
};

export const mutations: MutationTree<RootState> = {
  [CycleMutation.SET_CURRENT_CYCLE]: (state, cycle: any) => (state.cycle = cycle),
  [CycleMutation.SET_TEMP_CYCLE]: (state, cycleTemp: Number) => (state.cycleTemp = cycleTemp),
};

export const actions: CycleAction<AuthState, RootState> = {
  getHistoryFeedback({ commit, state }, cycleId: Number): Promise<any> {
    return new Promise((resolve, reject) => {
      HistoryRepository.get(cycleId)
        .then((data) => {
          console.log(data);
          resolve(data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },
};
