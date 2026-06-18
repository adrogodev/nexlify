"use client"

import Image from "next/image";
import Link from "next/link";
import { SIDEBAR_ITEMS } from "../constants";
import { Sidebar, SidebarContent, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarTrigger, useSidebar } from "../ui";
import { NavComponent } from "./nav.component";

export function SidebarComponent({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const { state } = useSidebar();
    const isCollapsed = state === "collapsed";

    return (
        <Sidebar variant="inset" collapsible="icon" {...props}>
            <SidebarHeader>
                <div className={`flex ${isCollapsed ? "justify-center" : "justify-end"}`}>
                    <SidebarTrigger className="cursor-pointer" />
                </div>
                {isCollapsed ? (
                    <Link href="/dashboard" className="flex justify-center">
                        <Image src="/assets/svgs/icon.svg" alt="nexlify" width={24} height={24} />
                    </Link>
                ) : (
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <SidebarMenuButton size="lg" asChild>
                                <Link href="/dashboard">
                                    <Image src="/assets/svgs/logo.svg" alt="logo_nexlify" width={90} height={31} />
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>
                )}
            </SidebarHeader>
            <SidebarContent>
                <NavComponent items={SIDEBAR_ITEMS} />
            </SidebarContent>
        </Sidebar>
    )
}