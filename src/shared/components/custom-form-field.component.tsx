"use client";

import { format } from "date-fns";
import { es } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import { useState } from "react";
import {
  Controller,
  type RegisterOptions,
  useFormContext,
} from "react-hook-form";
import { cn } from "@/src/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/src/shared/ui/popover";
import { Button, Calendar, Input } from "../ui";

type Props = {
  name: string;
  label: string;
  placeholder?: string;
  input_mode?: React.InputHTMLAttributes<HTMLInputElement>["inputMode"];
  type?: "text" | "email" | "password" | "number";
  register_options?: RegisterOptions;
  error_message?: string;
  disabled?: boolean;
  onChange?: (value: string) => void;
  className?: string;
};

export const CustomFormField = ({
  name,
  label,
  placeholder = "",
  input_mode,
  type = "text",
  register_options = {},
  error_message,
  disabled = false,
  onChange,
  className,
}: Props) => {
  const [is_calendar_open, set_is_calendar_open] = useState(false);
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      rules={register_options}
      render={({ field, fieldState: field_state }) => {
        const error = getError(field_state, error_message);

        const handle_calendar_change = (date?: Date) => {
          field.onChange(date ? format(date, "yyyy-MM-dd") : "");
          set_is_calendar_open(false);
          if (date) onChange?.(format(date, "yyyy-MM-dd"));
        };

        return (
          <div className={cn("flex flex-col gap-1", className)}>
            <label htmlFor={name} className="text-sm font-medium">
              {label}
            </label>

            {type === "text" || type === "email" || type === "number" ? (
              <Input
                id={name}
                type="text"
                inputMode={
                  input_mode ??
                  (type === "number"
                    ? "decimal"
                    : type === "email"
                      ? "email"
                      : undefined)
                }
                autoComplete={
                  type === "email" ? "email" : type === "number" ? "off" : "off"
                }
                placeholder={placeholder}
                value={field.value ?? ""}
                onChange={(e) => {
                  field.onChange(e.target.value);
                  onChange?.(e.target.value);
                }}
                onBlur={field.onBlur}
                disabled={disabled || field.disabled}
                aria-invalid={Boolean(error)}
                aria-describedby={error ? `${name}-error` : undefined}
              />
            ) : (
              <Popover
                open={is_calendar_open}
                onOpenChange={set_is_calendar_open}
              >
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    type="button"
                    role="combobox"
                    aria-expanded={is_calendar_open}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !field.value && "text-muted-foreground",
                      error && "border-red-500",
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {field.value ? (
                      format(new Date(`${field.value}T00:00:00`), "PPP", {
                        locale: es,
                      })
                    ) : (
                      <span>{placeholder}</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={
                      field.value
                        ? new Date(`${field.value}T00:00:00`)
                        : undefined
                    }
                    defaultMonth={
                      field.value
                        ? new Date(`${field.value}T00:00:00`)
                        : undefined
                    }
                    onSelect={handle_calendar_change}
                    autoFocus
                  />
                  {field.value && (
                    <div className="p-2 border-t">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="w-full"
                        onClick={() => handle_calendar_change(undefined)}
                      >
                        Limpiar
                      </Button>
                    </div>
                  )}
                </PopoverContent>
              </Popover>
            )}

            {error && (
              <p
                id={`${name}-error`}
                role="alert"
                className="text-sm text-red-500"
              >
                {error}
              </p>
            )}
          </div>
        );
      }}
    />
  );
};

function getError(
  field_state: { error?: { message?: string } },
  error_message?: string,
): string | undefined {
  return (
    field_state.error?.message ??
    (field_state.error ? error_message : undefined)
  );
}

export default CustomFormField;
