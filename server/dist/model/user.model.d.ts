import { Pool } from "mysql2/promise";
import { User, UserDTO } from "../constant/user.constant";
declare class UserModel {
    private pool;
    constructor(pool: Pool);
    createUser({ email, username, role, password }: UserDTO): Promise<number>;
    getAllUsers(): Promise<User[]>;
    getUserByEmail(email: string): Promise<User | null>;
    getUserByUsername(username: string): Promise<User | null>;
    getUserById(id: number): Promise<User | null>;
    updateUserByEmail(email: string, data: UserDTO): Promise<number>;
    updateUserById(id: number, data: Partial<UserDTO>): Promise<number>;
}
export default UserModel;
//# sourceMappingURL=user.model.d.ts.map