import { ActionContext, ActionTree, GetterTree, MutationTree } from 'vuex';
import { ObjectiveDTO, KeyResultDTO } from '@/constants/DTO/okrs';
import OkrsRepository from '@/repositories/OkrsRepository';

export enum OkrsMutation {
  SET_ISDIALOGOKRS = 'setIsDialogOKRs',
  SET_OBJECTIVE_PARENT = 'setObjectiveParent',
  SET_OBJECTIVE = 'setObjective',
  SET_KEY_RESULTS = 'setKeyResults',
  CLEAR_KRS = 'clearKrs',
  SET_STAFF_OKRS = 'setStaffOkrs',
}

export interface OkrsState {
  isDialogOKRs: Boolean;
  objectiveParent: Number;
  objective: ObjectiveDTO;
  keyResults: KeyResultDTO[] | null;
  staffOkrs: any[] | null;
}

export const state = (): OkrsState => ({
  isDialogOKRs: false,
  objectiveParent: 0,
  objective: {
    id: 0,
    title: '',
    projectId: 0,
    parentId: 0,
    type: 0,
    weight: 0,
    cycleId: 0,
    alignmentObjectives: [],
    keyResults: [],
  },
  keyResults: null,
  staffOkrs: null,
});

export type RootState = ReturnType<typeof state>;

export const getters: GetterTree<RootState, RootState> = {
  isDialogOKRs: (state) => state.isDialogOKRs,
  objectiveParent: (state) => state.objectiveParent,
  objective: (state) => state.objective,
  keyResults: (state) => state.keyResults,
  staffOkrs: (state) => state.staffOkrs,
};

export const mutations: MutationTree<RootState> = {
  [OkrsMutation.SET_ISDIALOGOKRS]: (state, data: Boolean) => (state.isDialogOKRs = data),
  [OkrsMutation.SET_OBJECTIVE_PARENT]: (state, data: Number) => (state.objectiveParent = data),
  [OkrsMutation.SET_OBJECTIVE]: (state, data: ObjectiveDTO) => (state.objective = data),
  [OkrsMutation.SET_KEY_RESULTS]: (state, data: KeyResultDTO[]) => (state.keyResults = [...data]),
  [OkrsMutation.CLEAR_KRS]: (state) => (state.keyResults = []),
  [OkrsMutation.SET_STAFF_OKRS]: (state, data: any) => (state.staffOkrs = data),
};

export interface OKRsAction<S, R> extends ActionTree<S, R> {
  setStaffOkrs(context: ActionContext<S, R>, payload: any): Promise<void>;
  clearStaffOkrs(context: ActionContext<S, R>, payload: any): void;
  clearOkrs(context: ActionContext<S, R>): void;
}

export const actions: OKRsAction<OkrsState, RootState> = {
  async setStaffOkrs({ commit }, { cycleId, type }): Promise<void> {
    try {
      const { data } = await OkrsRepository.getListOkrs(cycleId, type);
      commit(OkrsMutation.SET_STAFF_OKRS, Object.freeze(data.data));
    } catch (error) {}
  },

  clearStaffOkrs({ commit }) {
    commit(OkrsMutation.SET_STAFF_OKRS, []);
  },

  clearOkrs({ commit }): void {
    commit(OkrsMutation.SET_OBJECTIVE, null);
    commit(OkrsMutation.CLEAR_KRS);
  },
};
