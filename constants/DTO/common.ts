export interface ParamsQuery {
  page?: number;
  limit?: number;
  text?: string;
}

export interface HistoryCfrsParams extends ParamsQuery {
  cycleId?: number;
  userId?: number;
  type?: 1 | 2 | 3;
}

export interface ParamsUser extends ParamsQuery {
  sortWith: string;
}

export interface AdminParams extends ParamsQuery {
  tab?: string;
}

export interface ParamsCFR extends ParamsQuery {
  status?: number;
}

export interface ParamsProject extends ParamsQuery {
  type?: string;
  sortWith: string;
}
