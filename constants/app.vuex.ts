export enum DispatchAction {
  LOGIN = 'auth/login',
  LOGOUT = 'auth/logout',
  CLEAR_AUTH = 'auth/clear',
  CLEAR_OKRS = 'okrs/clearOkrs',
  CLEAR_STAFF_OKRS = 'okrs/clearStaffOkrs',
  GET_MEASURE = 'measure/getMeasure',
  CLEAR_MEASURE = 'measure/clearMeasure',
}

export enum GetterState {
  USER = 'auth/user',
  CYCLE_TEMP = 'cycle/cycleTemp',
  CYCLE_CURRENT = 'cycle/cycleCurrent',
  OKRS_IS_DIALOG_OKRS = 'okrs/isDialogOKRs',
  OKRS_OBJECTIVE_PARENT = 'okrs/objectiveParent',
  OKRS_LIST_OBJECTIVE_PARENT = 'okrs/listObjectiveParent',
}

export enum MutationState {
  SET_USER = 'auth/setUser',
  SET_TOKEN = 'auth/setToken',
  SET_TEMP_USER = 'user/setTempUser',
  SET_USERS = 'user/setUsers',
  SET_CURRENT_CYCLE = 'cycle/setCurrentCycle',
  SET_OBJECTIVE = 'okrs/setObjective',
  SET_KEY_RESULT = 'okrs/setKeyResult',
  CLEAR_KRS = 'okrs/clearKrs',
  SET_OKRS_DETAIL = 'okrs/setOkrsDetail',
  SET_TEMP_CYCLE = 'cycle/setTempCycle',
  SET_ALL_CYCLES = 'cycle/setAllCycles',
  SET_IS_DIALOG_OKRS = 'okrs/setIsDialogOKRs',
  SET_OBJECTIVE_PARENT = 'okrs/setObjectiveParent',
  SET_LIST_OBJECTIVE_PARENT = 'okrs/setListObjectiveParent',
  SET_LIST_OBJECTIVE_ALIGN = 'okrs/setListObjectiveAlign',
}
