"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class UserModel {
    pool;
    constructor(pool) {
        this.pool = pool;
    }
    async createUser({ email, username, role, password }) {
        try {
            const [rows] = await this.pool.query("INSERT INTO users(username, email,role, password) VALUES(?,?,?,?)", [username, email, role, password]);
            return rows.insertId;
        }
        catch (e) {
            throw new Error(`Error: ${e}`);
        }
    }
    async getAllUsers() {
        try {
            const [rows] = await this.pool.query("SELECT * FROM users");
            return rows;
        }
        catch (e) {
            console.log(`....Fetching error ${e}`);
            throw new Error(`${e}`);
        }
    }
    async getUserByEmail(email) {
        try {
            const [rows] = await this.pool.query("SELECT * FROM users WHERE email = ?", [email]);
            const users = rows;
            if (users.length <= 0) {
                return null;
            }
            return users[0] ?? null;
        }
        catch (e) {
            console.log(`....Fetching user by email ${e}`);
            throw new Error(`${e}`);
        }
    }
    async getUserByUsername(username) {
        try {
            const [rows] = await this.pool.query("SELECT * FROM users WHERE username = ?", [username]);
            const users = rows;
            if (users.length <= 0) {
                return null;
            }
            return users[0] ?? null;
        }
        catch (e) {
            console.log(`....Fetching user by username ${e}`);
            throw new Error(`${e}`);
        }
    }
    async getUserById(id) {
        try {
            const [rows] = await this.pool.query("SELECT * FROM users WHERE id = ?", [id]);
            const users = rows;
            if (users.length <= 0) {
                return null;
            }
            return users[0] ?? null;
        }
        catch (e) {
            console.log(`....Fetching user by id ${e}`);
            throw new Error(`${e}`);
        }
    }
    async updateUserByEmail(email, data) {
        try {
            const userDetails = { ...data };
            const keys = Object.keys(userDetails);
            if (!keys)
                return 0;
            const setClause = keys.map(key => (`${key} = ?`)).join(", ");
            console.log(setClause);
            return 1;
        }
        catch (e) {
            console.log(`....Fetching user by email ${e}`);
            throw new Error(`${e}`);
        }
    }
    async updateUserById(id, data) {
        try {
            const keys = Object.keys(data);
            if (keys.length === 0) {
                return 0;
            }
            const setClause = keys.map((key) => `${key} = ?`).join(", ");
            const values = keys.map((key) => data[key]);
            const [result] = await this.pool.query(`UPDATE users SET ${setClause} WHERE id = ?`, [...values, id]);
            return result.affectedRows;
        }
        catch (e) {
            console.log(`....Updating user by id error ${e}`);
            throw new Error(`${e}`);
        }
    }
}
exports.default = UserModel;
//# sourceMappingURL=user.model.js.map