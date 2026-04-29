import { Pool } from "mysql2/promise";
export interface ActivityRow {
    id?: number;
    user_id: number;
    role: string;
    action: string;
    resource: string;
    details?: string | undefined;
    ip?: string | undefined;
    user_agent?: string | undefined;
    created_at?: Date | undefined;
}
declare class ActivityModel {
    private pool;
    constructor(pool: Pool);
    ensureTable(): Promise<void>;
    createActivity(row: ActivityRow): Promise<number>;
    queryActivities(filters: {
        role?: string;
        user_id?: number;
        action?: string;
        resource?: string;
        start?: string;
        end?: string;
        exclude_user_id?: number;
        offset?: number;
        limit?: number;
    }): Promise<{
        rows: ActivityRow[];
        total: any;
    }>;
}
export default ActivityModel;
//# sourceMappingURL=activity.model.d.ts.map