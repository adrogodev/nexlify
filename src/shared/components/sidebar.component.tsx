"use client"

import Image from "next/image";
import Link from "next/link";
import { SIDEBAR_ITEMS } from "../constants";
import { Sidebar, SidebarContent, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "../ui";
import { NavComponent } from "./nav.component";

export function SidebarComponent({ ...props }: React.ComponentProps<typeof Sidebar>) {
    return (
        <Sidebar variant="inset" collapsible="icon" {...props}>
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/dashboard">
                                <Image src="/assets/svgs/logo.svg" alt="logo_nexlify" width={90} height={31}>

                                </Image>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
                <NavComponent items={SIDEBAR_ITEMS} />
            </SidebarContent>
        </Sidebar>
    )
}