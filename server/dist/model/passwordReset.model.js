"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class PasswordResetModel {
    pool;
    constructor(pool) {
        this.pool = pool;
        this.ensureTable();
    }
    async ensureTable() {
        const sql = `CREATE TABLE IF NOT EXISTS password_reset_tokens (
      id INT PRIMARY KEY AUTO_INCREMENT,
      user_id INT NOT NULL,
      token_hash VARCHAR(128) NOT NULL UNIQUE,
      expires_at TIMESTAMP NOT NULL,
      used_at TIMESTAMP NULL DEFAULT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      INDEX idx_password_reset_user_id (user_id),
      INDEX idx_password_reset_expires_at (expires_at)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`;
        try {
            await this.pool.query(sql);
        }
        catch (e) {
            console.error("Failed to ensure password_reset_tokens table:", e);
        }
    }
    async deleteTokensByUserId(userId) {
        await this.pool.query("DELETE FROM password_reset_tokens WHERE user_id = ?", [userId]);
    }
    async createToken(userId, tokenHash, expiresAt) {
        const [result] = await this.pool.query("INSERT INTO password_reset_tokens (user_id, token_hash, expires_at) VALUES (?, ?, ?)", [userId, tokenHash, expiresAt]);
        return result.insertId;
    }
    async findValidToken(tokenHash) {
        const [rows] = await this.pool.query(`SELECT * FROM password_reset_tokens
       WHERE token_hash = ? AND used_at IS NULL AND expires_at > NOW()
       LIMIT 1`, [tokenHash]);
        return rows[0] ?? null;
    }
    async markTokenUsed(tokenId) {
        await this.pool.query("UPDATE password_reset_tokens SET used_at = NOW() WHERE id = ?", [tokenId]);
    }
}
exports.default = PasswordResetModel;
//# sourceMappingURL=passwordReset.model.js.map