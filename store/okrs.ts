import { ActionContext, ActionTree, GetterTree, MutationTree } from 'vuex';
import { ObjectiveDTO, KeyResultDTO } from '@/constants/app.interface';
import OkrsRepository from '@/repositories/OkrsRepository';

export enum OkrsMutation {
  SET_OBJECTIVE = 'setObjective',
  SET_KEY_RESULT = 'setKeyResult',
  CLEAR_KRS = 'clearKrs',
  SET_STAFF_OKRS = 'setStaffOkrs',
}

export enum OkrsAction {}

export interface OkrsState {
  objective: ObjectiveDTO | null;
  keyResults: KeyResultDTO[];
  staffOkrs: any[];
}

export interface OKRsAction<S, R> extends ActionTree<S, R> {
  setStaffOkrs(context: ActionContext<S, R>): Promise<void>;
  clearOkrs(context: ActionContext<S, R>): void;
}

export const state = (): OkrsState => ({
  objective: null,
  keyResults: [],
  staffOkrs: [],
});

export type RootState = ReturnType<typeof state>;

export const getters: GetterTree<RootState, RootState> = {
  objective: (state) => state.objective,
  keyResults: (state) => state.keyResults,
  staffOkrs: (state) => state.staffOkrs,
};

export const mutations: MutationTree<RootState> = {
  [OkrsMutation.SET_OBJECTIVE]: (state, objective: ObjectiveDTO) => (state.objective = objective),
  [OkrsMutation.SET_KEY_RESULT]: (state, keyResult: KeyResultDTO) => state.keyResults.push(keyResult),
  [OkrsMutation.CLEAR_KRS]: (state) => (state.keyResults = []),
  [OkrsMutation.SET_STAFF_OKRS]: (state, staffOkrs: any) => (state.staffOkrs = staffOkrs),
};

export const actions: OKRsAction<OkrsState, RootState> = {
  async setStaffOkrs({ commit }) {
    try {
      const { data } = await OkrsRepository.getStaffOkrs();
      commit(OkrsMutation.SET_STAFF_OKRS, Object.freeze(data.data));
    } catch (error) {}
  },
  clearOkrs({ commit }) {
    commit(OkrsMutation.SET_OBJECTIVE, null);
    commit(OkrsMutation.CLEAR_KRS);
  },
};
