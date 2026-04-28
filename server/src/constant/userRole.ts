export const ROLES = {
  ADMIN: "admin",
  SUPER_ADMIN: "super_admin",
  TEACHER: "teacher"
} as const;

export type Role = typeof ROLES[keyof typeof ROLES];