export enum elComponent {
  ElRow = 'ElRow',
  ElCol = 'ElCol',
  ElContainer = 'ElContainer',
  ElButton = 'ElButton',
  ElInput = 'ElInput',
  ElForm = 'ElForm',
  ElFormItem = 'ElFormItem',
  ElStep = 'ElStep',
  ElSteps = 'ElSteps',
  ElPagination = 'ElPagination',
  ElDatePicker = 'ElDatePicker',
  ElDropdown = 'ElDropdown',
  ElDropdownItem = 'ElDropdownItem',
  ElDropdownMenu = 'ElDropdownMenu',
  ElTree = 'ElTree',
  ElTable = 'ElTable',
  ElTableColumn = 'ElTableColumn',
  ElTabs = 'ElTabs',
  ElTabPane = 'ElTabPane',
  ElCheckbox = 'ElCheckbox',
  ElIcon = 'ElIcon',
  ElDialog = 'ElDialog',
  ElAutocomplete = 'ElAutocomplete',
  ElTooltip = 'ElTooltip',
  ElSelect = 'ElSelect',
  ElOption = 'ElOption',
  ElRadioGroup = 'ElRadioGroup',
  ElAvatar = 'ElAvatar',
  ElRadio = 'ElRadio',
  ElUpload = 'ElUpload',
  ElProgress = 'ElProgress',
  ElPopover = 'ElPopover',
  ElPageHeader = 'ElPageHeader',
  ElTag = 'ElTag',
  ElDrawer = 'ElDrawer',
  ElSlider = 'ElSlider',
  ElInputNumber = 'ElInputNumber',
}

export enum UserStatus {
  Staff = 'Nhân viên',
  All = 'Tất cả',
}

export enum ProjectStatus {
  All = 'all',
  Active = 'active',
  Closed = 'closed',
}

export enum TabCfr {
  Feedback = 'Danh sách chờ phản hồi',
  History = 'Lịch sử',
  Rank = 'Bảng xếp hạng',
}

export enum TabCfrEng {
  Feedback = 'feedback',
  History = 'history',
  Rank = 'rank',
}

export enum AdminTabsVn {
  CycleOKR = 'Quản lý chu kỳ',
  Department = 'Quản lý phòng ban',
  JobPosition = 'Quản lý vị trí công việc',
  EvaluationCriterial = 'Quản lý tiêu chí đánh giá',
  MeasureUnit = 'Quản lý đơn vị đo lường',
}

export enum AdminTabsEn {
  CycleOKR = 'quan-ly-chu-ky',
  Department = 'quan-ly-phong-ban',
  JobPosition = 'quan-ly-vi-tri-cong-viec',
  EvaluationCriterial = 'quan-ly-tieu-chi-danh-gia',
  MeasureUnit = 'quan-ly-don-vi-do-luong',
}

export enum SidebarTabs {
  Dashboar = 'Dashboard',
  Checkin = 'Checkin',
  OKRs = 'OKRs',
  CFRs = 'CFRs',
  SettingCompany = 'Cài đặt công ty',
  ManageHumanResources = 'Quản lý nhân sự',
}

export enum ResourcesEnpoint {
  Auth = 'auth',
  Users = 'user',
  Lessons = 'lessons',
  ResetPassword = 'reset_password',
  Me = 'me',
  Job = 'positions',
  Department = 'departments',
  Role = 'roles',
  CycleOKRs = 'cycles',
  EvaluationCriterial = 'evaluations',
  MeasureUnit = 'measure',
  MetaData = 'meta_data',
  Objective = 'objectives',
  KeyResults = 'key_results',
  Checkin = 'checkins',
  CFRs = 'cfrs',
  Dashboard = 'dashboard',
  Project = 'projects',
}

export enum CFREnpoint {
  ListWaiting = 'list_waiting',
  History = 'history',
  Rank = 'user_star',
  Recognition = 'user_recognition',
  Objective = 'list_okrs',
}

export enum EvaluationCriteriaEnum {
  MEMBER_TO_LEADER = 'MEMBER_TO_LEADER',
  LEADER_TO_MEMBER = 'LEADER_TO_MEMBER',
  EvaluationCriteria = 'evaluation_criteria',
  RECOGNITION = 'RECOGNITION',
}
