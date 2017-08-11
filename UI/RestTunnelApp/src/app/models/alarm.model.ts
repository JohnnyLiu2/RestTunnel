export interface AlarmModel {
    acknowledgedTime: number;
    clearedTime: number;
    createdTime: number;
    id: string;
    message: string;
    ruleId: string;
    severity: number;
    sourceID: string;
    sourceName: string;
    topologyObjectID: string;
    acknowledged: boolean;
    cleared: boolean;
 }
