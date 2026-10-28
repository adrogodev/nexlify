/** Mirror of the backend EmailStateEnum (nexlify-provider/src/core/domain/enum). */
export type TEmailState =
  | "QUEUED"
  | "SENDING"
  | "SENT"
  | "WARNING"
  | "FAILED"
  | "RETRYING"
  | "RECEIVED";
