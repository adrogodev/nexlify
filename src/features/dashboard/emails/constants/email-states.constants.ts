import type { TEmailState } from "../types/email-states.types";

export const EMAIL_STATE_OPTIONS: Array<{ value: TEmailState; label: string }> =
  [
    { value: "QUEUED", label: "En cola" },
    { value: "SENDING", label: "Enviando" },
    { value: "SENT", label: "Enviado" },
    { value: "WARNING", label: "Advertencia" },
    { value: "FAILED", label: "Fallido" },
    { value: "RETRYING", label: "Reintentando" },
    { value: "RECEIVED", label: "Recibido" },
  ];
