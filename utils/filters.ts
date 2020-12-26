export function filterKeyresults(keyResults: any): String {
  return keyResults.length + ' kết quả';
}

enum rolesName {
  director = 'Giám đốc',
  admin = 'Admin',
  hr = 'Quản lý nhân sự',
  pm = 'Quản lý dự án',
  staff = 'Nhân viên',
}

export function filterUserRole(userRoles: String[]) {
  if (userRoles.includes('ROLE_DIRECTOR')) {
    return rolesName.director;
  } else if (userRoles.includes('ROLE_ADMIN')) {
    return rolesName.admin;
  } else if (userRoles.includes('ROLE_HR')) {
    return rolesName.hr;
  } else if (userRoles.includes('ROLE_PM')) {
    return rolesName.pm;
  } else {
    return rolesName.staff;
  }
}

export function getUserRole(userRole: string) {
  if (userRole === 'ROLE_DIRECTOR') {
    return rolesName.director;
  } else if (userRole === 'ROLE_ADMIN') {
    return rolesName.admin;
  } else if (userRole === 'ROLE_HR') {
    return rolesName.hr;
  } else if (userRole === 'ROLE_PM') {
    return rolesName.pm;
  } else {
    return rolesName.staff;
  }
}
