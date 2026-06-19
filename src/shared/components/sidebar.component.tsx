"use client"

import { PanelLeftIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { SIDEBAR_ITEMS } from "../constants";
import { Sidebar, SidebarContent, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from "../ui";
import { NavComponent } from "./nav.component";

export function SidebarComponent({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const { state, toggleSidebar } = useSidebar();
    const isCollapsed = state === "collapsed";

    return (
        <Sidebar variant="inset" collapsible="icon" {...props}>
            {!isCollapsed && (
                <SidebarHeader>
                    <div className="flex items-center justify-between">
                        <SidebarMenu>
                            <SidebarMenuItem>
                                <SidebarMenuButton size="lg" asChild>
                                    <Link href="/dashboard">
                                        <Image src="/assets/svgs/logo.svg" alt="logo_nexlify" width={90} height={31} />
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        </SidebarMenu>
                        <PanelLeftIcon className="cursor-pointer" onClick={toggleSidebar} />
                    </div>
                </SidebarHeader>
            )}
            <SidebarContent>
                <NavComponent items={SIDEBAR_ITEMS}>
                    {isCollapsed && (
                        <>
                            <SidebarMenuItem>
                                <SidebarMenuButton className="cursor-pointer" onClick={toggleSidebar}>
                                    <PanelLeftIcon />
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                            <SidebarMenuItem>
                                <SidebarMenuButton asChild>
                                    <Link href="/dashboard">
                                        <Image src="/assets/svgs/icon.svg" alt="nexlify" width={24} height={24} />
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        </>
                    )}
                </NavComponent>
            </SidebarContent>
        </Sidebar>
    )
}