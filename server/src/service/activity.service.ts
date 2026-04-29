import ActivityModel, { ActivityRow } from "../model/activity.model";

class ActivityService {
  constructor(private activityModel: ActivityModel) {}

  async recordActivity(row: ActivityRow) {
    return this.activityModel.createActivity(row);
  }

  async listActivities(filters: any) {
    return this.activityModel.queryActivities(filters);
  }
}

export default ActivityService;
