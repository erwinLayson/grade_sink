"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class UserService {
    userModel;
    constructor(userModel) {
        this.userModel = userModel;
    }
    async createUser(user) {
        try {
            const userId = this.userModel.createUser(user);
            return userId;
        }
        catch (e) {
            throw new Error(`Error: ${e}`);
        }
    }
    async getAllUser() {
        try {
            const users = await this.userModel.getAllUsers();
            return users.map(user => ({
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.role
            }));
        }
        catch (e) {
            console.log(`Errror ${e}`);
            throw new Error(`Error: ${e}`);
        }
    }
    async getUserByEmail(email) {
        try {
            const user = await this.userModel.getUserByEmail(email);
            if (!user) {
                return null;
            }
            return {
                username: user.username,
                email: user.email,
                role: user.role
            };
        }
        catch (e) {
            console.log(`Errror ${e}`);
            throw new Error(`Error: ${e}`);
        }
    }
    async updateUserByEmail(email, data) {
        try {
            const result = await this.userModel.updateUserByEmail(email, data);
            return result;
        }
        catch (e) {
            throw new Error(`Error: ${e}`);
        }
    }
}
exports.default = UserService;
//# sourceMappingURL=user.service.js.map