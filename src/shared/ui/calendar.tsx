"use client"

import * as React from "react"
import { DayPicker, getDefaultClassNames } from "react-day-picker"
import { Button, buttonVariants } from "./button"
import { cn } from "@/src/lib/utils"

function Calendar({
    className,
    classNames,
    showOutsideDays = true,
    captionLayout = "label",
    button_variant = "ghost",
    formatters,
    components,
    ...props
}: React.ComponentProps<typeof DayPicker> & {
    button_variant?: React.ComponentProps<typeof Button>["variant"]
}) {
    const default_class_names = getDefaultClassNames();

    return (
        <DayPicker
            showOutsideDays={showOutsideDays}
            className={cn(
                "bg-background group/calendar p-3 [--cell-size:--spacing(8)] in-data-[slot=card-content]:bg-transparent in-data-[slot=popover-content]:bg-transparent",
                String.raw`rtl:**:[.rdp-button\_next>svg]:rotate-180`,
                String.raw`rtl:**:[.rdp-button\_previous>svg]:rotate-180`,
                className
            )}
            captionLayout={captionLayout}
            formatters={{
                formatMonthDropdown: (date) =>
                    date.toLocaleDateString("default", { month: "short" }),
                ...formatters
            }}
            classNames={{
                root: cn("w-fit", default_class_names.root),
                months: cn(
                    "flex gap-4 flex-col md:flex-row relative",
                    default_class_names.months
                ),
                month: cn("flex flex-col w-full gap-4", default_class_names.month),
                nav: cn(
                    "flex items-center gap-1 w-full absolute top-0 inset-x-0 justify-between",
                    default_class_names.nav
                ),
                button_previous: cn(
                    buttonVariants({ variant: button_variant }),
                    "size-(--cell-size) aria-disabled:opacity-50 p-0 select-none",
                    default_class_names.button_previous
                ),
                button_next: cn(
                    buttonVariants({ variant: button_variant }),
                    "size-(--cell-size) aria-disabled:opacity-50 p-0 select-none",
                    default_class_names.button_next
                ),
                month_caption: cn(
                    "flex items-center justify-center h-(--cell-size) w-full px-(--cell-size)",
                    default_class_names.month_caption
                ),
                dropdowns: cn(
                    "w-full flex items-center text-sm font-medium justify-center h-(--cell-size) gap-1.5",
                    default_class_names.dropdowns
                )
            }}
        >

        </DayPicker>
    )
}
