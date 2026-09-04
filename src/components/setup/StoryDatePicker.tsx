"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Field, FieldLabel } from "@/components/ui/field";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface StoryDatePickerProps {
  value: string;
  onChange: (value: string) => void;
}

function parseDate(value: string) {
  if (!value) return undefined;

  const [year, month, day] = value.split("-").map(Number);

  if (!year || !month || !day) return undefined;

  return new Date(year, month - 1, day);
}

function toBackendDate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export default function StoryDatePicker({
  value,
  onChange,
}: StoryDatePickerProps) {
  const [open, setOpen] = React.useState(false);

  const date = parseDate(value);

  return (
    <Field className="w-full">
      <FieldLabel className="block text-sm text-ruby/70">Story date</FieldLabel>

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger
          render={
            <Button
              type="button"
              variant="outline"
              className="h-10 w-full justify-start rounded-lg border border-ruby/20 bg-white/70 text-ruby text-sm focus:outline-none focus:border-ruby/50"
            >
              {date
                ? date.toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })
                : "Select date"}
            </Button>
          }
        />

        <PopoverContent className="w-auto overflow-hidden p-0" align="start">
          <Calendar
            mode="single"
            selected={date}
            defaultMonth={date}
            captionLayout="dropdown"
            onSelect={(selectedDate: Date | undefined) => {
              if (!selectedDate) return;

              onChange(toBackendDate(selectedDate));
              setOpen(false);
            }}
          />
        </PopoverContent>
      </Popover>
    </Field>
  );
}
