"use client"

import { usePathname, useRouter } from "next/navigation";
import { SIDEBAR_ITEMS } from "../constants";
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "../ui";

export const CustomBreadcrumb = () => {

    // const distpatch = useAppDispatch();

    const pathname = usePathname();
    const router = useRouter();
    const path = pathname.split("/").filter((item) => item !== "");

    const getLabel = (segment: string) => {
        const item = SIDEBAR_ITEMS.find(nav => nav.url.split("/").pop() === segment);
        return item ? item.title : segment.charAt(0).toUpperCase() + segment.slice(1);
    }

    const isId = (segment: string) => !isNaN(Number(segment)) || segment.length > 20;

    const segments = path.slice(1);

    const mainSegment = segments[0];
    const pathName = mainSegment ? getLabel(mainSegment) : "Home";


    const secondarySegment = segments[1];
    const subPath = (secondarySegment && !isId(secondarySegment)) ? 'Detalles' : "";

    return (
        <div className="w-full flex items-center py-3">
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem className="hidden md:block">
                        <BreadcrumbPage className={`text-xs font-bold ${subPath ? 'cursor-pointer' : ''}`} onClick={subPath ? () => router.back() : undefined}>
                            {pathName}
                        </BreadcrumbPage>
                    </BreadcrumbItem>
                    {subPath && (<BreadcrumbSeparator className="hidden md:block" />)}
                    {
                        subPath &&
                        (
                            <BreadcrumbItem>
                                <BreadcrumbPage>{subPath}</BreadcrumbPage>
                            </BreadcrumbItem>
                        )
                    }
                </BreadcrumbList>
            </Breadcrumb>
        </div>
    )
}