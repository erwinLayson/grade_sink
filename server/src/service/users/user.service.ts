import UserModel from "../../model/user.model";
import { UserDTO, UserResponse } from "../../constant/user.constant";

class UserService {
  constructor(private userModel: UserModel) { }
  
  async createUser(user: UserDTO) {
    try {

      const userId = this.userModel.createUser(user);
      return userId;
    } catch (e) {
      throw new Error(`Error: ${e}`);
    }
  }

  async getAllUser(): Promise<UserResponse[]> {
    try {
      const users = await this.userModel.getAllUsers();
      return users.map(user => ({
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role
      }));
    } catch (e) {
      console.log(`Errror ${e}`);
      throw new Error(`Error: ${e}`);  
    }
  }

  async getUserByEmail(email: string): Promise<UserResponse | null> {
    try {
      const user = await this.userModel.getUserByEmail(email);

      if (!user) {
        return null
      }

      return {
        username: user.username,
        email: user.email,
        role: user.role
      }
    } catch (e) {
      console.log(`Errror ${e}`);
      throw new Error(`Error: ${e}`);  
    }
  }

  async updateUserByEmail(email: string, data: UserDTO): Promise<number> {
    try {
      const result = await this.userModel.updateUserByEmail(email, data);
      return result;
    } catch (e) {
      throw new Error(`Error: ${e}`);
    }
  }

}

export default UserService;