"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ActivityModel {
    pool;
    constructor(pool) {
        this.pool = pool;
        this.ensureTable();
    }
    async ensureTable() {
        const sql = `CREATE TABLE IF NOT EXISTS activity_logs (
      id INT PRIMARY KEY AUTO_INCREMENT,
      user_id INT NOT NULL,
      role VARCHAR(64) NOT NULL,
      action VARCHAR(128) NOT NULL,
      resource VARCHAR(128) NOT NULL,
      details JSON NULL,
      ip VARCHAR(45) NULL,
      user_agent TEXT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`;
        try {
            await this.pool.query(sql);
        }
        catch (e) {
            console.error("Failed to ensure activity_logs table:", e);
        }
    }
    async createActivity(row) {
        try {
            const [result] = await this.pool.query(`INSERT INTO activity_logs (user_id, role, action, resource, details, ip, user_agent) VALUES (?, ?, ?, ?, ?, ?, ?)`, [row.user_id, row.role, row.action, row.resource, row.details ?? null, row.ip ?? null, row.user_agent ?? null]);
            return result.insertId;
        }
        catch (e) {
            throw new Error(`Error creating activity: ${e}`);
        }
    }
    async queryActivities(filters) {
        try {
            const where = [];
            const params = [];
            if (filters.role) {
                where.push("role = ?");
                params.push(filters.role);
            }
            if (filters.user_id) {
                where.push("user_id = ?");
                params.push(filters.user_id);
            }
            if (filters.action) {
                where.push("action = ?");
                params.push(filters.action);
            }
            if (filters.resource) {
                where.push("resource = ?");
                params.push(filters.resource);
            }
            if (filters.start) {
                where.push("created_at >= ?");
                params.push(filters.start);
            }
            if (filters.end) {
                where.push("created_at <= ?");
                params.push(filters.end);
            }
            if (filters.exclude_user_id) {
                where.push("user_id != ?");
                params.push(filters.exclude_user_id);
            }
            const whereClause = where.length > 0 ? `WHERE ${where.join(" AND ")}` : "";
            const limit = filters.limit ?? 50;
            const offset = filters.offset ?? 0;
            const rowsSql = `SELECT * FROM activity_logs ${whereClause} ORDER BY created_at DESC LIMIT ? OFFSET ?`;
            const [rows] = await this.pool.query(rowsSql, [...params, limit, offset]);
            const countSql = `SELECT COUNT(*) as total FROM activity_logs ${whereClause}`;
            const [countRows] = await this.pool.query(countSql, params);
            // @ts-ignore
            const total = countRows[0]?.total ?? 0;
            return { rows: rows, total };
        }
        catch (e) {
            throw new Error(`Error querying activities: ${e}`);
        }
    }
}
exports.default = ActivityModel;
//# sourceMappingURL=activity.model.js.map