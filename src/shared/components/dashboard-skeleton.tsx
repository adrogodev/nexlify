import { Skeleton } from "../ui";

export const DashboardSkeleton = () => {
    return (
        <div className="flex h-screen w-full bg-background overflow-hidden animate-in fade-in duration-500">
            {/* Sidebar Skeleton */}
            <aside className="w-[260px] border-r flex flex-col p-4 gap-8 bg-gray-50/40 shrink-0">
                <div className="flex items-center gap-3 px-2 py-1">
                    <Skeleton className="size-10 rounded-lg shrink-0" />
                    <div className="space-y-2 flex-1">
                        <Skeleton className="h-4 w-2/3" />
                        <Skeleton className="h-3 w-1/2" />
                    </div>
                </div>

                <nav className="space-y-6 flex-1 px-2">
                    <div className="space-y-3">
                        {Array.from({ length: 6 }, (_, i) => ({ id: `skeleton-nav-${i}` })).map((item) => (
                            <div key={item.id} className="flex items-center gap-3 py-1">
                                <Skeleton className="size-5 rounded shrink-0 opacity-60" />
                                <Skeleton className="h-4 w-3/4" />
                            </div>
                        ))}
                    </div>
                </nav>

                <div className="mt-auto border-t pt-4 px-2">
                    <div className="flex items-center gap-3">
                        <Skeleton className="size-9 rounded-full shrink-0" />
                        <div className="space-y-2 flex-1">
                            <Skeleton className="h-4 w-3/4" />
                            <Skeleton className="h-3 w-full" />
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content Skeleton */}
            <div className="flex-1 flex flex-col h-full min-w-0">
                <header className="h-16 border-b flex items-center px-6 gap-4 shrink-0 bg-background/50">
                    <Skeleton className="size-5 rounded shrink-0" />
                    <div className="h-4 w-px bg-gray-200 shrink-0" />
                    <Skeleton className="h-4 w-40" />
                </header>

                <section className="flex-1 p-6 space-y-6 overflow-hidden">
                    <div className="flex flex-col gap-6 h-full">
                        {/* Title and Action area */}
                        <div className="flex justify-between items-center shrink-0">
                            <div className="space-y-2">
                                <Skeleton className="h-8 w-64" />
                                <Skeleton className="h-4 w-48 opacity-60" />
                            </div>
                            <Skeleton className="h-10 w-32 rounded-lg" />
                        </div>

                        {/* Table-like area */}
                        <div className="border rounded-xl flex-1 flex flex-col overflow-hidden bg-white/50">
                            <div className="p-4 border-b flex gap-4 bg-gray-50/30 shrink-0">
                                {Array.from({ length: 4 }, (_, i) => ({ id: `skeleton-tab-${i}` })).map((tab) => (
                                    <Skeleton key={tab.id} className="h-9 w-28 rounded-lg" />
                                ))}
                            </div>
                            <div className="p-6 space-y-5 flex-1 overflow-hidden">
                                {Array.from({ length: 10 }, (_, i) => ({ id: `skeleton-row-${i}` })).map((row) => (
                                    <div key={row.id} className="flex gap-4 items-center">
                                        <Skeleton className="h-12 flex-1 rounded-lg opacity-40" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};
