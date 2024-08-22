const allRoles = {
  user: ['manageCourts', 'getCourts','manageConfig','getConfig','getShifts','manageShifts','manageAddon','getAddon','getClub', 'manageClub'],
  admin: ['getUsers', 'manageUsers', 'manageCourts', 'getCourts','manageConfig','getConfig','manageAddon','getAddon','getShifts','manageShifts', 'getClub', 'manageClub'],
};

export const roles: string[] = Object.keys(allRoles);
export const roleRights: Map<string, string[]> = new Map(Object.entries(allRoles));
