export interface ObjectiveDTO {
  title: string;
  parentObjectiveId: number | null;
  cycleId: number;
}

export interface KeyResultDTO {
  id?: number;
  content: string;
  startValue: number;
  targetValue: number;
  linkPlans?: string;
  linkResults?: string;
  measureUnitId: number;
}
