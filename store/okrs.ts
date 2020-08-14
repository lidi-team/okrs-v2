import { ActionContext, ActionTree, GetterTree, MutationTree } from 'vuex';
import { ObjectiveDTO, KeyResultDTO } from '@/constants/app.interface';
import OkrsRepository from '@/repositories/OkrsRepository';
import UserRepository from '@/repositories/UserRepository';

export enum OkrsMutation {
  SET_OBJECTIVE = 'setObjective',
  SET_KRS = 'setKrs',
  SET_CURRENT_LEADER = 'setCurrentLeader',
  SET_STAFF_OKRS = 'setStaffOkrs',
}

export enum OkrsAction {
  SET_CURRENT_LEADER = 'setCurrentLeader',
}

export interface OkrsState {
  objective: ObjectiveDTO | null;
  krs: KeyResultDTO[] | [];
  currentLeader: any;
  staffOkrs: any[];
}

export interface OKRsAction<S, R> extends ActionTree<S, R> {
  setCurrentLeader(context: ActionContext<S, R>): Promise<void>;
  setStaffOkrs(context: ActionContext<S, R>): Promise<void>;
}

export const state = (): OkrsState => ({
  objective: null,
  krs: [],
  currentLeader: null,
  staffOkrs: [],
});

export type RootState = ReturnType<typeof state>;

export const getters: GetterTree<RootState, RootState> = {
  objective: (state) => state.objective,
  krs: (state) => state.krs,
  currentLeader: (state) => state.currentLeader,
  staffOkrs: (state) => state.staffOkrs,
};

export const mutations: MutationTree<RootState> = {
  [OkrsMutation.SET_OBJECTIVE]: (state, objective: ObjectiveDTO) => (state.objective = objective),
  [OkrsMutation.SET_KRS]: (state, krs: KeyResultDTO[]) => (state.krs = krs),
  [OkrsMutation.SET_CURRENT_LEADER]: (state, currentLeader: any) => (state.currentLeader = currentLeader),
  [OkrsMutation.SET_STAFF_OKRS]: (state, staffOkrs: any) => (state.staffOkrs = staffOkrs),
};

export const actions: OKRsAction<OkrsState, RootState> = {
  async setStaffOkrs({ commit }) {
    try {
      const { data } = await OkrsRepository.getStaffOkrs();
      commit(OkrsMutation.SET_STAFF_OKRS, Object.freeze(data.data));
    } catch (error) {}
  },
  async setCurrentLeader({ commit }) {
    try {
      const { data } = await UserRepository.me();
      const userId = data.data.id;
      const leaderOkrs = await OkrsRepository.getLeaderOkrs(userId, 1);
      commit(OkrsMutation.SET_CURRENT_LEADER, Object.freeze(leaderOkrs.data.data));
    } catch (error) {}
  },
};
