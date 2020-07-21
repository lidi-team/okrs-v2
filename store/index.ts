import Vue from 'vue';
import Vuex from 'vuex';
import { AuthState, UserState } from '@/constants/app.interface';

Vue.use(Vuex);

export interface IRootState {
  auth: AuthState;
  user: UserState;
}

export default new Vuex.Store<IRootState>({});
