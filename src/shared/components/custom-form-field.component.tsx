"use client"

import { Popover } from "@radix-ui/react-popover"
import { useMemo, useState } from "react"
import { Controller, RegisterOptions, useFormContext } from "react-hook-form"

type FieldMode = 'text' | 'currency' | 'number' | 'decimal' | 'percentage' | 'amount'

type Props = {
    name: string,
    label: string,
    placeholder?: string,
    type?: 'text' | 'email' | 'date',
    mode?: FieldMode,
    register_options?: RegisterOptions,
    error_message: string,
    onChange?: (e: any) => void,
    calendarProps?: any
}

export const CustomFormField = ({
    name,
    label,
    placeholder = '',
    type = 'text',
    mode = 'text',
    register_options = {},
    error_message,
    onChange,
    calendarProps
}: Props) => {

    const [isOpen, setIsOpen] = useState(false);
    const { control } = useFormContext();

    const isValidNumber = (value: unknown) =>
        value !== '' && value !== null && value !== undefined && !isNaN(Number(value))

    // return (
    //     <Controller
    //         name={name}
    //         control={control}
    //         rules={register_options}
    //         render={({ field, field_state }) => (
    //             <div className="flex flex-col gap-1">
    //                 <label htmlFor={name} className="text-sm font-medium">
    //                     {label}
    //                 </label>

    //                 { type === 'date' ? (
    //                     <Popover></Popover>
    //                 )

    //                 }
    //             </div>
    //         )}
    //     >

    //     </Controller>
    // )

}