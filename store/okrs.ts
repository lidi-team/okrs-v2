import { ActionContext, ActionTree, GetterTree, MutationTree } from 'vuex';
import { ObjectiveDTO, KeyResultDTO } from '@/constants/DTO/okrs';

export enum OkrsMutation {
  SET_FLAG = 'setFlag',
  SET_TITLE_DIALOG_OKRS = 'setTitleDialogOkrs',
  SET_DIALOG_OKRS = 'setIsDialogOKRs',
  CLEAR_KRS = 'clearKrs',
  SET_STAFF_OKRS = 'setStaffOkrs',
  SET_OBJECTIVE_PARENT = 'setObjectiveParent',
  SET_LIST_OBJECTIVE_ALIGN = 'setListObjectiveAlign',
  SET_OBJECTIVE = 'setObjective',
  SET_KEY_RESULT = 'setKeyResult',
}

export interface OkrsState {
  flag: Boolean;
  titleDialogOkrs: String;
  isDialogOKRs: Boolean;
  objectiveParent: Number;
  listObjectiveAlign: any[];
  objective: ObjectiveDTO;
}

const initObjective: ObjectiveDTO = {
  id: null,
  title: '',
  projectId: 0,
  parentId: null,
  type: 0,
  weight: 0,
  cycleId: 0,
  alignmentObjectives: [],
  keyResults: [],
};

export const state = (): OkrsState => ({
  flag: false,
  titleDialogOkrs: '',
  isDialogOKRs: false,
  objectiveParent: 0,
  listObjectiveAlign: [],
  objective: initObjective,
});

export type RootState = ReturnType<typeof state>;

export const getters: GetterTree<RootState, RootState> = {
  flag: (state) => state.flag,
  titleDialogOkrs: (state) => state.titleDialogOkrs,
  isDialogOKRs: (state) => state.isDialogOKRs,
  objectiveParent: (state) => state.objectiveParent,
  listObjectiveAlign: (state) => state.listObjectiveAlign,
  objective: (state) => state.objective,
};

export const mutations: MutationTree<RootState> = {
  [OkrsMutation.SET_FLAG]: (state) => (state.flag = !state.flag),
  [OkrsMutation.SET_TITLE_DIALOG_OKRS]: (state, data: String) => (state.titleDialogOkrs = data),
  [OkrsMutation.SET_DIALOG_OKRS]: (state, data: Boolean) => (state.isDialogOKRs = data),
  [OkrsMutation.SET_OBJECTIVE_PARENT]: (state, data: Number) => (state.objectiveParent = data),
  [OkrsMutation.SET_LIST_OBJECTIVE_ALIGN]: (state, data: any[]) => (state.listObjectiveAlign = data),
  [OkrsMutation.SET_OBJECTIVE]: (state, data: any) => (state.objective = { ...state.objective, ...data }),
  [OkrsMutation.SET_KEY_RESULT]: (state, data: KeyResultDTO[]) => (state.objective.keyResults = [...data]),
};

export interface OKRsAction<S, R> extends ActionTree<S, R> {
  createDialogOKRs(context: ActionContext<S, R>): void;
  updateDialogOKRs(context: ActionContext<S, R>, data: any): void;
  closeDialogOKRs(context: ActionContext<S, R>): void;
}

export const actions: OKRsAction<OkrsState, RootState> = {
  createDialogOKRs({ commit }): void {
    commit(OkrsMutation.SET_TITLE_DIALOG_OKRS, 'Tạo OKRs');
    commit(OkrsMutation.SET_DIALOG_OKRS, true);
    commit(OkrsMutation.SET_OBJECTIVE, initObjective);
  },

  updateDialogOKRs({ commit }, data: ObjectiveDTO): void {
    commit(OkrsMutation.SET_TITLE_DIALOG_OKRS, 'Cập nhật OKRs');
    commit(OkrsMutation.SET_DIALOG_OKRS, true);
    commit(OkrsMutation.SET_OBJECTIVE, data);
  },

  closeDialogOKRs({ commit }): void {
    commit(OkrsMutation.SET_DIALOG_OKRS, false);
    commit(OkrsMutation.SET_OBJECTIVE, initObjective);
  },
};
