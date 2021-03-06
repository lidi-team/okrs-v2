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
  id: Number | null;
  title: String;
  projectId: Number;
  parentId: Number | null;
  type: Number;
  weight: Number;
  cycleId: Number;
  alignmentObjectives: Array<Number>;
  keyResults: any;
}
