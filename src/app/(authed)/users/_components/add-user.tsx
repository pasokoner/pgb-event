"use client";

import { UserPlus } from "lucide-react";

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
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { type TNewUserSchema, newUserSchema } from "@/lib/types";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/trpc/react";
import { Input } from "@/components/ui/input";

export default function AddUser() {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const { mutate, isLoading, error } = api.user.create.useMutation({
    onSuccess: () => {
      setOpen(false);
      form.reset();
      router.refresh();
    },
  });

  const form = useForm<TNewUserSchema>({
    resolver: zodResolver(newUserSchema),
    defaultValues: {
      username: "",
      password: "",
      fullName: "",
    },
  });

  function onSubmit(data: TNewUserSchema) {
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
          <DialogTitle className="text-xl font-bold">New event</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="grid gap-4 py-4"
          >
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input autoComplete="off" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input autoComplete="off" type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
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
