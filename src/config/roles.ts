const allRoles = {
  user: ['manageCourts', 'getCourts','manageConfig','getConfig','getShifts','manageShifts','manageAddon','getAddon', 'getClub', 'manageClub','getShiftPlayers'],
  admin: ['getUsers', 'manageUsers', 'manageCourts', 'getCourts','manageConfig','getConfig','getShifts','manageShifts'],
};

export const roles: string[] = Object.keys(allRoles);
export const roleRights: Map<string, string[]> = new Map(Object.entries(allRoles));
