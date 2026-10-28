import {
  FileCode2,
  KeyRound,
  Mail,
  Settings2,
  UserPlus2,
  Users,
  Webhook,
} from "lucide-react";
import type { ISidebar } from "../interfaces";

export const AUTH_TOKEN = "auth-token";

export const SIDEBAR_ITEMS: ISidebar[] = [
  { title: "Clients", url: "/dashboard/clients", icon: Users },
  { title: "Users", url: "/dashboard/users", icon: UserPlus2 },
  { title: "Emails", url: "/dashboard/emails", icon: Mail },
  { title: "Templates", url: "/dashboard/templates", icon: FileCode2 },
  { title: "Nexlify Keys", url: "/dashboard/keys", icon: KeyRound },
  { title: "Webhooks", url: "/dashboard/webhooks", icon: Webhook },
  { title: "Configuration", url: "/dashboard/configuration", icon: Settings2 },
];
