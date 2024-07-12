const allRoles = {
  user: ['manageCourts', 'getCourts','manageConfig','getConfig','getShifts','manageShifts','manageAddon','getAddon'],
  admin: ['getUsers', 'manageUsers', 'manageCourts', 'getCourts','manageConfig','getConfig','getShifts','manageShifts'],
};

export const roles: string[] = Object.keys(allRoles);
export const roleRights: Map<string, string[]> = new Map(Object.entries(allRoles));
