import UserModel from "../../model/user.model";
import { UserDTO, UserResponse } from "../../constant/user.constant";
declare class UserService {
    private userModel;
    constructor(userModel: UserModel);
    createUser(user: UserDTO): Promise<number>;
    getAllUser(): Promise<UserResponse[]>;
    getUserByEmail(email: string): Promise<UserResponse | null>;
    updateUserByEmail(email: string, data: UserDTO): Promise<number>;
}
export default UserService;
//# sourceMappingURL=user.service.d.ts.map