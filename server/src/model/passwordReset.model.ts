import { Pool, ResultSetHeader, RowDataPacket } from "mysql2/promise";

export interface PasswordResetTokenRow {
  id?: number;
  user_id: number;
  token_hash: string;
  expires_at: Date;
  used_at?: Date | null;
  created_at?: Date;
}

class PasswordResetModel {
  private pool: Pool;

  constructor(pool: Pool) {
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
    } catch (e) {
      console.error("Failed to ensure password_reset_tokens table:", e);
    }
  }

  async deleteTokensByUserId(userId: number) {
    await this.pool.query("DELETE FROM password_reset_tokens WHERE user_id = ?", [userId]);
  }

  async createToken(userId: number, tokenHash: string, expiresAt: Date): Promise<number> {
    const [result] = await this.pool.query<ResultSetHeader>(
      "INSERT INTO password_reset_tokens (user_id, token_hash, expires_at) VALUES (?, ?, ?)",
      [userId, tokenHash, expiresAt],
    );

    return result.insertId;
  }

  async findValidToken(tokenHash: string): Promise<PasswordResetTokenRow | null> {
    const [rows] = await this.pool.query<RowDataPacket[]>(
      `SELECT * FROM password_reset_tokens
       WHERE token_hash = ? AND used_at IS NULL AND expires_at > NOW()
       LIMIT 1`,
      [tokenHash],
    );

    return (rows[0] as PasswordResetTokenRow) ?? null;
  }

  async markTokenUsed(tokenId: number) {
    await this.pool.query("UPDATE password_reset_tokens SET used_at = NOW() WHERE id = ?", [tokenId]);
  }
}

export default PasswordResetModel;