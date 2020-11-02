export interface ParamsQuery {
  paging?: number;
  size?: number;
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
