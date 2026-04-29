"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllUser = getAllUser;
exports.getUserByEmail = getUserByEmail;
exports.createUser = createUser;
exports.updateUserByEmail = updateUserByEmail;
const user_service_1 = __importDefault(require("../service/users/user.service"));
const user_model_1 = __importDefault(require("../model/user.model"));
const dbConnection_config_1 = require("../config/dbConnection.config");
const bcrypt_1 = __importDefault(require("bcrypt"));
async function getAllUser(req, res) {
    try {
        const userService = new user_service_1.default(new user_model_1.default(dbConnection_config_1.pool));
        const users = await userService.getAllUser();
        res.status(200).json(users);
    }
    catch (e) {
        throw new Error(`Error: ${e}`);
    }
}
async function getUserByEmail(req, res) {
    try {
        const email = req.params.email;
        const userService = new user_service_1.default(new user_model_1.default(dbConnection_config_1.pool));
        const users = await userService.getUserByEmail(email);
        res.status(200).json(users);
    }
    catch (e) {
        throw new Error(`Error: ${e}`);
    }
}
async function createUser(req, res) {
    try {
        const { email, password, role, username } = req.body;
        if (!email || !password || !role || !username)
            return res.status(400).json({ msg: "Invalid user credential" });
        const hashPassword = await bcrypt_1.default.hash(password, 10);
        const userService = new user_service_1.default(new user_model_1.default(dbConnection_config_1.pool));
        const result = await userService.createUser({ email, password: hashPassword, role, username });
        if (result) {
            return res.status(200).json({ msg: `${role.toLocaleLowerCase()} account is created` });
        }
    }
    catch (e) {
        throw new Error(`Error: ${e}`);
    }
}
async function updateUserByEmail(req, res) {
    const email = req.params.email;
    const data = req.body;
    const userService = new user_service_1.default(new user_model_1.default(dbConnection_config_1.pool));
    const result = await userService.updateUserByEmail(email, data);
    console.log(result);
}
//# sourceMappingURL=user.controller.js.map