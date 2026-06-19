import { CustomBreadcrumb, PlaceholderComponent, SidebarComponent } from "@/src/shared/components"
import { Separator, SidebarInset, SidebarProvider } from "@/src/shared/ui"

export default function DashboardLayout({ children }: React.PropsWithChildren) {
    return (
        <SidebarProvider>
            <SidebarComponent />
            <SidebarInset className="h-[calc(100vh-1rem)] overflow-hidden">
                <header className="flex h-16 items-start gap-2 px-4">
                    <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
                    <CustomBreadcrumb />
                    <div className="w-52 py-5">
                        <PlaceholderComponent />
                    </div>
                </header>
                <div className="flex flex-1 flex-col overflow-y-auto h-[calc(100vh-2rem)] overflow-hidden ">
                    {children}
                </div>
            </SidebarInset>
        </SidebarProvider>
    )
}
