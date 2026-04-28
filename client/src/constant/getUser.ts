import type { ROLE } from "./user";

export type GetUserProps = {
  id:number;
  username: string,
  email: string,
  role: ROLE
}

