"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ActivityService {
    activityModel;
    constructor(activityModel) {
        this.activityModel = activityModel;
    }
    async recordActivity(row) {
        return this.activityModel.createActivity(row);
    }
    async listActivities(filters) {
        return this.activityModel.queryActivities(filters);
    }
}
exports.default = ActivityService;
//# sourceMappingURL=activity.service.js.map