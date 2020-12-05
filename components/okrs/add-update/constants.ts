export interface ObjectiveAlignDTO {
  id: Number;
  name: String;
  type: Number;
  user: String;
}

export interface KeyResultDTO {
  content: String;
  keyResultParentId: Number;
  linkPlans: String;
  linkResults: String;
  startValue: Number;
  targetedValue: Number;
  measureUnitId: Number;
}
