"use client"

import * as React from "react"
import { useForm, useFieldArray } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { CalendarIcon, Loader2, Plus, Trash2 } from "lucide-react"
import { format } from "date-fns"
import { DateRange } from "react-day-picker"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Calendar } from "@/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"

const tripSchema = z.object({
    origin: z.string().min(3, "Origin is required"),
    destinations: z.array(
        z.object({
            location: z.string().min(3, "Destination is required"),
        })
    ).min(1, "At least one destination is required"),
    groupSize: z.coerce.number().min(1, "Group size must be at least 1"),
    dates: z.object({
        from: z.date(),
        to: z.date().optional(),
    }).refine((data) => data.from, { message: "Start date is required" }),
})

export function TripRequestForm() {
    const [isLoading, setIsLoading] = React.useState<boolean>(false)
    const [date, setDate] = React.useState<DateRange | undefined>()

    const form = useForm({
        resolver: zodResolver(tripSchema),
        defaultValues: {
            destinations: [{ location: "" }],
            groupSize: 1,
        },
    })

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "destinations",
    })

    async function onSubmit(data: z.infer<typeof tripSchema>) {
        setIsLoading(true)
        try {
            const user = JSON.parse(localStorage.getItem('user') || '{}')
            const tripData = {
                user: user._id,
                origin: { address: data.origin },
                stops: data.destinations.map((dest, idx) => ({
                    address: dest.location,
                    order: idx + 1
                })),
                groupSize: data.groupSize,
                startDate: data.dates.from,
                endDate: data.dates.to || data.dates.from
            }

            const response = await fetch('http://localhost:5001/api/trips', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(tripData)
            })

            if (response.ok) {
                toast.success("Trip requested successfully!", {
                    description: "We will notify you when a driver accepts.",
                })
                form.reset()
                setDate(undefined)
            } else {
                toast.error("Failed to create trip")
            }
        } catch (error) {
            toast.error("Network error")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid gap-4">
                <div className="grid gap-2">
                    <Label htmlFor="origin">Origin</Label>
                    <Input
                        id="origin"
                        placeholder="Enter starting location"
                        disabled={isLoading}
                        {...form.register("origin")}
                    />
                    {form.formState.errors.origin && (
                        <p className="text-sm text-red-500">
                            {form.formState.errors.origin.message}
                        </p>
                    )}
                </div>

                <div className="grid gap-2">
                    <Label>Destinations</Label>
                    {fields.map((field, index) => (
                        <div key={field.id} className="flex gap-2">
                            <Input
                                placeholder={`Destination ${index + 1}`}
                                disabled={isLoading}
                                {...form.register(`destinations.${index}.location`)}
                            />
                            {index > 0 && (
                                <Button
                                    type="button"
                                    variant="destructive"
                                    size="icon"
                                    onClick={() => remove(index)}
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            )}
                        </div>
                    ))}
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="mt-2 w-fit"
                        onClick={() => append({ location: "" })}
                    >
                        <Plus className="mr-2 h-4 w-4" />
                        Add Destination
                    </Button>
                    {form.formState.errors.destinations && (
                        <p className="text-sm text-red-500">
                            {form.formState.errors.destinations.message}
                        </p>
                    )}
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="groupSize">Group Size</Label>
                    <Input
                        id="groupSize"
                        type="number"
                        min={1}
                        disabled={isLoading}
                        {...form.register("groupSize")}
                    />
                    {form.formState.errors.groupSize && (
                        <p className="text-sm text-red-500">
                            {form.formState.errors.groupSize.message}
                        </p>
                    )}
                </div>

                <div className="grid gap-2">
                    <Label>Trip Dates</Label>
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                id="date"
                                variant={"outline"}
                                className={cn(
                                    "w-full justify-start text-left font-normal",
                                    !date && "text-muted-foreground"
                                )}
                            >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {date?.from ? (
                                    date.to ? (
                                        <>
                                            {format(date.from, "LLL dd, y")} -{" "}
                                            {format(date.to, "LLL dd, y")}
                                        </>
                                    ) : (
                                        format(date.from, "LLL dd, y")
                                    )
                                ) : (
                                    <span>Pick a date range</span>
                                )}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                                initialFocus
                                mode="range"
                                defaultMonth={date?.from}
                                selected={date}
                                onSelect={(newDate) => {
                                    setDate(newDate)
                                    if (newDate?.from) {
                                        form.setValue("dates.from", newDate.from)
                                    }
                                    if (newDate?.to) {
                                        form.setValue("dates.to", newDate.to)
                                    }
                                }}
                                numberOfMonths={2}
                            />
                        </PopoverContent>
                    </Popover>
                    {form.formState.errors.dates && (
                        <p className="text-sm text-red-500">
                            {form.formState.errors.dates.root?.message || "Date is required"}
                        </p>
                    )}
                </div>

                <Button type="submit" disabled={isLoading}>
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Request Trip
                </Button>
            </div>
        </form>
    )
}
