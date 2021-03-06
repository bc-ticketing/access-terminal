export const TIMEOUT = 2000;
export const STATUS_REQUEST_INTERVAL = 1000;

export const REGISTER_MAPPING = "/registerTerminal";
export const NEW_CODE_MAPPING = "/NewSecretCode";
export const STATUS_MAPPING = "/getTerminalStatus";
export const NR_TICKETS_MAPPING = "/getNumberOfTicketsSelected";
export const DENIED_MESSAGE_MAPPING = "/getErrorMessage";
export const UNREGISTER_MAPPING = "/unRegisterTerminal";

export const QUERY_TERMINAL_ID = "terminalId=";
export const QUERY_SECRET = "secret=";
export const QUERY_AREA_FROM = "areaAccessFrom=";
export const QUERY_AREA_TO = "areaAccessTo=";

export const AREA_ENTRANCE = "ENTRANCE";
export const AREA_GENERAL = "GENERAL";
export const AREA_STANDINGAREA = "STANDINGAREA";
export const AREA_SEATINGAREA1 = "SEATINGAREA1";
export const AREA_SEATINGAREA2 = "SEATINGAREA2";
export const AREA_VIPAREA = "VIPAREA";

export const DEFAULT_ERROR = "Oops! Looks like we hit a roadblock!";

// Progress bar states
export const PROGRESS_DETERMINATE = "determinate";
export const PROGRESS_INDETERMINATE = "indeterminate";
