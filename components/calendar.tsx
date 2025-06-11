"use client"

import { useState } from "react"

import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { CalendarIcon } from "@radix-ui/react-icons"
import { Button } from "./ui/button"

export function PopoverCalendar({date, setDate}: {date: Date, setDate: (date: Date) => void}) {
  const [open, setOpen] = useState(false)

  return (
    <div className="flex flex-col gap-3 float-end">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
            <Button variant="outline" className="w-full justify-start text-left font-normal">
                <span className="text-sm">{date.toDateString()}</span>
                <CalendarIcon />
            </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto overflow-hidden p-0" align="start">
          <Calendar
            mode="single"
            selected={date}
            captionLayout="dropdown"
            onSelect={(date) => {
              setDate(date || new Date())
              setOpen(false)
            }}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}
