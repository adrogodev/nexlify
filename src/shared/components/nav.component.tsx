"use client"

import type { LucideIcon } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/src/lib/utils"
import { Collapsible, CollapsibleContent, CollapsibleTrigger, SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuAction, SidebarMenuButton, SidebarMenuItem, SidebarMenuSub, SidebarMenuSubButton, SidebarMenuSubItem } from "../ui"

type NavComponentProps = {
    items: {
        title: string,
        url: string,
        icon: LucideIcon
        isActive?: boolean
        items?: {
            title: string,
            url: string
        }[]
    }[]
}

export const NavComponent = ({ items }: NavComponentProps) => {
    const pathname = usePathname();

    return (
        <SidebarGroup>
            {/* <SidebarGroupLabel>Módulos</SidebarGroupLabel> */}
            <SidebarMenu>
                {items.map((item) => (
                    <Collapsible key={item.title} asChild defaultOpen={item.isActive}>
                        <SidebarMenuItem>
                            <SidebarMenuButton asChild tooltip={item.title} className={cn("", pathname.includes(item.url) && "bg-gray-100")}>
                                <Link href={item.url}>
                                    <item.icon />
                                    <span>{item.title}</span>
                                </Link>
                            </SidebarMenuButton>
                            {item.items?.length ? (
                                <>
                                    <CollapsibleTrigger asChild>
                                        <SidebarMenuAction className="data-[state=open]:rotate-90">
                                            <span className="sr-only">Toggle</span>
                                        </SidebarMenuAction>
                                    </CollapsibleTrigger>
                                    <CollapsibleContent>
                                        <SidebarMenuSub>
                                            {item.items?.map((subItem) => (
                                                <SidebarMenuSubItem key={subItem.title}>
                                                    <SidebarMenuSubButton asChild>
                                                        <Link href={subItem.url}>
                                                            <span>{subItem.title}</span>
                                                        </Link>
                                                    </SidebarMenuSubButton>
                                                </SidebarMenuSubItem>
                                            ))}
                                        </SidebarMenuSub>
                                    </CollapsibleContent>
                                </>
                            )
                                : null
                            }
                        </SidebarMenuItem>
                    </Collapsible>
                ))}
            </SidebarMenu>
        </SidebarGroup>
    )
}