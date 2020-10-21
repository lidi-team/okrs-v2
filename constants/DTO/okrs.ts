export interface KeyResultDTO {
  id: number | null;
  content: String;
  parentId?: Number;
  startValue: Number;
  targetValue: Number;
  valueObtained?: Number;
  measureUnitId: Number;
  reference?: String;
}

export interface ObjectiveDTO {
  id: number | null;
  title: String;
  content: String;
  userId: Number;
  projectId: Number;
  parentId: Number;
  type: Number;
  weight: Number;
  cycleId: Number;
  changing: Number;
  progress: Number;
  status: String;
  alignmentObjectives: Array<any>;
  keyResults: Array<KeyResultDTO>;
}
