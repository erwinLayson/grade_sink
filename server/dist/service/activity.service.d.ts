import ActivityModel, { ActivityRow } from "../model/activity.model";
declare class ActivityService {
    private activityModel;
    constructor(activityModel: ActivityModel);
    recordActivity(row: ActivityRow): Promise<number>;
    listActivities(filters: any): Promise<{
        rows: ActivityRow[];
        total: any;
    }>;
}
export default ActivityService;
//# sourceMappingURL=activity.service.d.ts.map