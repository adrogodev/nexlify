/**
 * Mirror of the backend ClientStateEnum
 * (nexlify-provider/src/core/domain/enum/client-state.enum.ts).
 * Keep both in sync when the backend enum changes.
 */
export const CLIENT_STATE = {
  ACTIVE: 1,
  INACTIVE: 2,
  ENABLEMENT_PENDING: 3,
} as const;

export const CLIENT_STATE_OPTIONS: Array<{ value: number; label: string }> = [
  { value: CLIENT_STATE.ACTIVE, label: "Activo" },
  { value: CLIENT_STATE.INACTIVE, label: "Inactivo" },
  { value: CLIENT_STATE.ENABLEMENT_PENDING, label: "Habilitación pendiente" },
];
