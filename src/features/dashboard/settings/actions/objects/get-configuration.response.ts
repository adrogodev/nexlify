import type { IBaseResponse } from "@/src/shared/interfaces";

// === Mirrors of the backend nexlify-configuration DTOs ===

export interface ISenderData {
  sender_email: string;
  sender_name: string;
  reply_to_email?: Nullable<string>;
  mail_application_password?: Nullable<string>;
}

export interface ISMTPData {
  provider?: Nullable<string>;
  name?: Nullable<string>;
  port?: Nullable<number>;
}

export interface ILimitData {
  daily_send_limit: number;
  max_retries: number;
  retry_interval_seconds: number;
}

export interface IPlatformEmailTemplate {
  header: Nullable<{
    email_header_text?: Nullable<string>;
    email_header_html?: Nullable<string>;
    email_header_img_url?: Nullable<string>;
  }>;
  footer: Nullable<{
    email_footer_text?: Nullable<string>;
    email_footer_html?: Nullable<string>;
    email_footer_img_url?: Nullable<string>;
  }>;
}

export interface IPlatformConfiguration {
  sender: ISenderData;
  smtp: ISMTPData;
  limits: ILimitData;
  template: IPlatformEmailTemplate;
}

export interface IGetConfigurationResponse
  extends IBaseResponse<IPlatformConfiguration> {}

export interface IAddSmtpServerParams {
  provider: string;
  host: string;
  port: number;
}

export interface IAddSmtpServerResponse extends IBaseResponse<boolean> {}
