export const BASE_URL = 'http://localhost:3000'; // Adjust port if necessary

export const ENTITIES = {
  AREAS: 'areas',
  ADDRESSES: 'addresses',
  USERS: 'users',
  USER_ADDRESSES: 'user-addresses',
  PROFILES: 'profiles',
  USER_PROFILES: 'user-profiles',
  ROLES: 'roles',
  PROFILE_ROLES: 'profile-roles',
  COURTS: 'courts',
  COURT_DIVISIONS: 'court-divisions',
  STATUSES: 'statuses',
  STAGES: 'stages',
  OUTCOMES: 'outcomes',
  CAUSES: 'causes',
  CAUSE_USERS: 'cause-users',
  CAUSE_STATUS_HISTORY: 'cause-status-history',
  CAUSE_STAGE_HISTORY: 'cause-stage-history',
  CAUSE_OUTCOME_HISTORY: 'cause-outcome-history',
  USER_SESSIONS: 'user-sessions',
};

export const getURI = (entity: string) => `${BASE_URL}/${entity}`;
