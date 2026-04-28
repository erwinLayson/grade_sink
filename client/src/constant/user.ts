const ROLES = {
  admin: ["manage:teacher", "manage:students"],
  super_admin: ["*"],
  teacher: ["manage:student", "manage:grades"]
} as const 

export type ROLE = keyof typeof ROLES;
export type PERMISSION = (typeof ROLES)[ROLE][number]

export type UserProps = {
  id: number;
  username: string
  email: string,
  role: ROLE,
}

export function hasPermission(user: UserProps, permission: PERMISSION) {
  return (ROLES[user.role] as readonly PERMISSION[]).includes(permission);
}