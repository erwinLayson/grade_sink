import { Pool } from "mysql2/promise";
export interface PasswordResetTokenRow {
    id?: number;
    user_id: number;
    token_hash: string;
    expires_at: Date;
    used_at?: Date | null;
    created_at?: Date;
}
declare class PasswordResetModel {
    private pool;
    constructor(pool: Pool);
    ensureTable(): Promise<void>;
    deleteTokensByUserId(userId: number): Promise<void>;
    createToken(userId: number, tokenHash: string, expiresAt: Date): Promise<number>;
    findValidToken(tokenHash: string): Promise<PasswordResetTokenRow | null>;
    markTokenUsed(tokenId: number): Promise<void>;
}
export default PasswordResetModel;
//# sourceMappingURL=passwordReset.model.d.ts.map