import { Pool } from "mysql2/promise"
import {User, UserDTO} from "../constant/user.constant";
import { ResultSetHeader } from "mysql2/promise";


class UserModel {
  private pool: Pool
  constructor(pool: Pool) {
    this.pool = pool
  }

  async createUser({email, username, role, password}: UserDTO): Promise<number> {
    try {
      const [rows] = await this.pool.query<ResultSetHeader>("INSERT INTO users(username, email,role, password) VALUES(?,?,?,?)", [username, email, role, password]);
      return rows.insertId
    } catch (e) {
      throw new Error(`Error: ${e}`);
    }
  }

  async getAllUsers():Promise<User[]>{
    try {
      const [rows] = await this.pool.query("SELECT * FROM users");
      return rows as User[]
    } catch (e) {
      console.log(`....Fetching error ${e}`)
      throw new Error(`${e}`);
    }
  }

  
  async getUserByEmail(email: string):Promise<User | null>{
    try {
      const [rows] = await this.pool.query("SELECT * FROM users WHERE email = ?", [email]);
      const users = rows as User[];

      if (users.length <= 0) {
        return null;
      }

      return users[0] ?? null
    } catch (e) {
      console.log(`....Fetching user by email ${e}`)
      throw new Error(`${e}`);
    }
  }

  async updateUserByEmail(email: string, data: UserDTO):Promise<number>{
    try {
      const userDetails = { ...data };

      const keys = Object.keys(userDetails);

      if (!keys) return 0
      
      const setClause = keys.map(key => (`${key} = ?`)).join(", ")
      console.log(setClause);

      return 1
    } catch (e) {
      console.log(`....Fetching user by email ${e}`)
      throw new Error(`${e}`);
    }
  }
}

export default UserModel;