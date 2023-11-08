"use client";

import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";

import { format, startOfMonth, lastDayOfMonth } from "date-fns";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { type TNewReportSchema, newReportSchema } from "@/lib/types";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";

type ReportFormProps = {
  onSubmitSuccess: (data: TNewReportSchema) => void;
};

export default function ReportForm({ onSubmitSuccess }: ReportFormProps) {
  const router = useRouter();
  const pathname = usePathname();

  const searchParams = useSearchParams();

  const form = useForm<TNewReportSchema>({
    resolver: zodResolver(newReportSchema),
    defaultValues: {
      title:
        "FLAG RAISING AND RETREAT CEREMONY ATTENDANCE AND TARDINESS REPORT",
      subtitle: "",
      position: "",
      preparedBy: "",
      officerPosition: "",
      fromDate: startOfMonth(new Date()),
      toDate: lastDayOfMonth(new Date()),
      notedBy: "",
    },
  });

  function onSubmit(data: TNewReportSchema) {
    onSubmitSuccess(data);
    const params = new URLSearchParams(searchParams);
    params.set("fromDate", data.fromDate.toISOString());
    params.set("toDate", data.toDate.toISOString());
    router.replace(`${pathname}?${params.toString()}`);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="grid grid-cols-2 gap-4 rounded-sm bg-white p-4 py-4"
      >
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem className="col-span-2">
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input autoComplete="off" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="subtitle"
          render={({ field }) => (
            <FormItem className="col-span-2">
              <FormLabel>Subtitle</FormLabel>
              <FormControl>
                <Input autoComplete="off" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="fromDate"
          render={({ field }) => (
            <FormItem className="col-span-2 flex flex-col sm:col-span-1">
              <FormLabel>From Date</FormLabel>
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
                    onSelect={(v) => {
                      if (v && v > form.watch("toDate")) {
                        form.setValue("toDate", v);
                      }
                      field.onChange(v);
                    }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="toDate"
          render={({ field }) => (
            <FormItem className="col-span-2 flex flex-col sm:col-span-1">
              <FormLabel>From Date</FormLabel>
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
                    disabled={(date) => date < form.watch("fromDate")}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="preparedBy"
          render={({ field }) => (
            <FormItem className="col-span-2 sm:col-span-1">
              <FormLabel>Prepared by</FormLabel>
              <FormControl>
                <Input autoComplete="off" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="position"
          render={({ field }) => (
            <FormItem className="col-span-2 sm:col-span-1">
              <FormLabel>Position (Prepared by)</FormLabel>
              <FormControl>
                <Input autoComplete="off" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="notedBy"
          render={({ field }) => (
            <FormItem className="col-span-2 sm:col-span-1">
              <FormLabel>Noted By</FormLabel>
              <FormControl>
                <Input autoComplete="off" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="officerPosition"
          render={({ field }) => (
            <FormItem className="col-span-2 sm:col-span-1">
              <FormLabel>Position (Noted by)</FormLabel>
              <FormControl>
                <Input autoComplete="off" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* {error && (
          <div className="text-sm font-medium text-destructive">
            {error.message}
          </div>
        )} */}

        <Button className="col-span-2 w-full" type="submit">
          Start Generating
        </Button>
      </form>
    </Form>
  );
}
