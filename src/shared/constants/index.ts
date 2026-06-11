import { ISidebar } from "../interfaces";
import { Users } from "lucide-react"

export const AUTH_TOKEN = 'auth-token';

export const SIDEBAR_OPTIONS: ISidebar[] = [
    { title: 'Clients', url: '/dashboard/clients', icon: Users }
]
