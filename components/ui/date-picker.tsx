'use client'

import { cn } from '@/lib/utils'
import { format } from 'date-fns'
import { CalendarIcon } from 'lucide-react'

import * as React from 'react'

import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover'

interface DatePickerProps {
    date?: Date
    onSelect?: (date?: Date) => void
    placeholder?: string
    className?: string
    disabled?: boolean
}

export function DatePicker({
    date,
    onSelect,
    placeholder = 'Pick a date',
    className,
    disabled = false,
}: DatePickerProps) {
    const handleSelect = (newDate?: Date) => {
        onSelect?.(newDate)
    }

    return (
        <div className={'w-full'}>
            <Popover>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        className={cn(
                            'w-[240px] justify-start text-left font-normal',
                            !date && 'text-muted-foreground',
                            className
                        )}
                        disabled={disabled}
                    >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? (
                            format(date, 'PPP')
                        ) : (
                            <span>{placeholder}</span>
                        )}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                        mode="single"
                        selected={date}
                        onSelect={handleSelect}
                        initialFocus
                        disabled={(date) => {
                            // Disable dates in the past
                            const today = new Date()
                            today.setHours(0, 0, 0, 0)
                            return date < today
                        }}
                    />
                </PopoverContent>
            </Popover>
        </div>
    )
}
