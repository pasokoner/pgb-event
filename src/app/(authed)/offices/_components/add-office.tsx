"use client";

import { UserPlus } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { type TNewOfficeSchema, newOfficeSchema } from "@/lib/types";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/trpc/react";
import { Input } from "@/components/ui/input";

export default function AddOffice() {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const { mutate, isLoading, error } = api.office.create.useMutation({
    onSuccess: () => {
      setOpen(false);
      form.reset();
      router.refresh();
    },
  });

  const form = useForm<TNewOfficeSchema>({
    resolver: zodResolver(newOfficeSchema),
    defaultValues: {
      acronym: "",
      name: undefined,
    },
  });

  function onSubmit(data: TNewOfficeSchema) {
    mutate(data);
  }

  return (
    <Dialog open={open} onOpenChange={(o) => setOpen(o)}>
      <DialogTrigger asChild>
        <Button size="sm" className="rounded-sm">
          <UserPlus className="mr-2" />
          Add User
        </Button>
      </DialogTrigger>
      <DialogContent className="gap-2 sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">New office</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="grid gap-4 py-4"
          >
            <FormField
              control={form.control}
              name="acronym"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Office Acronym</FormLabel>
                  <FormControl>
                    <Input autoComplete="off" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Office Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="(optional)"
                      autoComplete="off"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {error && (
              <div className="text-sm font-medium text-destructive">
                {error.message}
              </div>
            )}

            <DialogFooter>
              <Button className="w-full" disabled={isLoading} type="submit">
                Create User
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
