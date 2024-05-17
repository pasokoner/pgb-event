"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { CalendarIcon } from "lucide-react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { type TNewEventSchema, newEventSchema } from "@/lib/types";

import { useRouter } from "next/navigation";

import {
  nextMonday,
  format,
  startOfToday,
  nextFriday,
  closestTo,
} from "date-fns";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { api } from "@/trpc/react";
import { useState } from "react";

type NewEventProps = {
  isFlagCeremony?: boolean;
};

export function NewEvent({ isFlagCeremony }: NewEventProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const { mutate, isLoading } = api.event.create.useMutation({
    onSuccess: () => {
      setOpen(false);
      form.reset();
      router.refresh();
    },
  });

  function getNearestDay() {
    const currentDate = new Date();

    const nextMondayDate = nextMonday(currentDate);
    const nextFridayDate = nextFriday(currentDate);

    return closestTo(currentDate, [nextMondayDate, nextFridayDate])!;
  }

  const form = useForm<TNewEventSchema>({
    resolver: zodResolver(newEventSchema),
    defaultValues: {
      name: isFlagCeremony
        ? `Flag Ceremony - ${format(getNearestDay(), "MM-dd-yy")}`
        : "",
      date: isFlagCeremony ? getNearestDay() : new Date(),
      type: isFlagCeremony ? "Flag Ceremony" : "",
    },
  });

  function onSubmit(data: TNewEventSchema) {
    mutate(data);
  }

  return (
    <Dialog open={open} onOpenChange={(o) => setOpen(o)}>
      <DialogTrigger asChild>
        <Button
          size="sm"
          variant="outline"
          className="rounded-sm border-primary bg-white text-xs text-primary hover:bg-white hover:text-primary sm:text-base"
        >
          {isFlagCeremony ? "Flag Ceremony" : "Custom Event"}
        </Button>
      </DialogTrigger>
      <DialogContent className="gap-2 sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">New event</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="grid gap-4 py-4"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground",
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="end">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) => date < startOfToday()}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>

                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="grid grid-cols-2 gap-2">
              <DialogClose asChild>
                <Button disabled={isLoading} variant="outline" type="button">
                  Cancel
                </Button>
              </DialogClose>
              <Button disabled={isLoading} type="submit">
                Save changes
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
