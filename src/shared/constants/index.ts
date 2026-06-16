import { Users } from "lucide-react"
import type { ISidebar } from "../interfaces";

export const AUTH_TOKEN = 'auth-token';

export const SIDEBAR_ITEMS: ISidebar[] = [
    { title: 'Clients', url: '/dashboard/clients', icon: Users }
]
