export interface AgentModel {
  state: string;
  adapterId: string;
  agentNamespace: string;
  build: string;
  healthState: number;
  id: string;
  hostName: string;
  isActive: boolean;
  isActivateable: boolean;
  isCollectingData: boolean;
  isBlackOut: boolean;
  isDeletable: boolean;
  name: string;
  remoteClientId: string;
  typeId: string;
  version: string;
}
