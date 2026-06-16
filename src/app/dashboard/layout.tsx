import { CustomBreadcrumb, SidebarComponent } from "@/src/shared/components"
import { Separator, SidebarInset, SidebarProvider, SidebarTrigger } from "@/src/shared/ui"

export default function DashboardLayout({ children }: React.PropsWithChildren) {
    return (
        <SidebarProvider>
            <SidebarComponent />
            <SidebarInset className="h-[calc(100vh-1rem)] overflow-hidden">
                <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4 bg-background">
                    <SidebarTrigger className="-ml-1" />
                    <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
                    <CustomBreadcrumb />
                </header>
                <div className="flex flex-1 flex-col overflow-y-auto h-[calc(100vh-2rem)] overflow-hidden ">
                    {children}
                </div>
            </SidebarInset>
        </SidebarProvider>
    )
}
