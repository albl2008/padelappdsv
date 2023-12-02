const allRoles = {
  user: ['manageCourts', 'getCourts','manageConfig','getConfig'],
  admin: ['getUsers', 'manageUsers', 'manageCourts', 'getCourts','manageConfig','getConfig'],
};

export const roles: string[] = Object.keys(allRoles);
export const roleRights: Map<string, string[]> = new Map(Object.entries(allRoles));
