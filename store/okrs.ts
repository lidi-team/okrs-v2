import { ActionContext, ActionTree, GetterTree, MutationTree } from 'vuex';
import { ObjectiveDTO, KeyResultDTO } from '@/constants/DTO/okrs';
import OkrsRepository from '@/repositories/OkrsRepository';

export enum OkrsMutation {
  SET_ISDIALOGOKRS = 'setIsDialogOKRs',
  CLEAR_KRS = 'clearKrs',
  SET_STAFF_OKRS = 'setStaffOkrs',
  SET_OBJECTIVE_PARENT = 'setObjectiveParent',
  SET_LIST_OBJECTIVE_PARENT = 'setListObjectiveParent',
  SET_LIST_OBJECTIVE_ALIGN = 'setListObjectiveAlign',
  SET_OBJECTIVE = 'setObjective',
  SET_KEY_RESULT = 'setKeyResult',
}

export interface OkrsState {
  isDialogOKRs: Boolean;
  objectiveParent: Number;
  listObjectiveParent: any[];
  listObjectiveAlign: any[];
  objective: ObjectiveDTO;
}

export const state = (): OkrsState => ({
  isDialogOKRs: false,
  objectiveParent: 0,
  listObjectiveParent: [],
  listObjectiveAlign: [],
  objective: {
    id: null,
    title: '',
    projectId: 0,
    parentId: null,
    type: 0,
    weight: 0,
    cycleId: 0,
    alignmentObjectives: [],
    keyResults: [],
  },
});

export type RootState = ReturnType<typeof state>;

export const getters: GetterTree<RootState, RootState> = {
  isDialogOKRs: (state) => state.isDialogOKRs,
  objectiveParent: (state) => state.objectiveParent,
  listObjectiveParent: (state) => state.listObjectiveParent,
  listObjectiveAlign: (state) => state.listObjectiveAlign,
  objective: (state) => state.objective,
};

export const mutations: MutationTree<RootState> = {
  [OkrsMutation.SET_ISDIALOGOKRS]: (state, data: Boolean) => (state.isDialogOKRs = data),
  [OkrsMutation.SET_OBJECTIVE_PARENT]: (state, data: Number) => (state.objectiveParent = data),
  [OkrsMutation.SET_LIST_OBJECTIVE_PARENT]: (state, data: any[]) => (state.listObjectiveParent = data),
  [OkrsMutation.SET_LIST_OBJECTIVE_ALIGN]: (state, data: any[]) => (state.listObjectiveAlign = data),
  [OkrsMutation.SET_OBJECTIVE]: (state, data: any) => (state.objective = { ...state.objective, ...data }),
  [OkrsMutation.SET_KEY_RESULT]: (state, data: KeyResultDTO[]) => (state.objective.keyResults = [...data]),
  [OkrsMutation.CLEAR_KRS]: (state) => (state.objective.keyResults = []),
};

export interface OKRsAction<S, R> extends ActionTree<S, R> {
  clearOkrs(context: ActionContext<S, R>): void;
}

export const actions: OKRsAction<OkrsState, RootState> = {
  clearOkrs({ commit }): void {
    commit(OkrsMutation.SET_OBJECTIVE, null);
    commit(OkrsMutation.CLEAR_KRS);
  },
};
