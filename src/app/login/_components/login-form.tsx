"use client";

import { zodResolver } from "@hookform/resolvers/zod";

import { useForm } from "react-hook-form";

import { type TLoginSchema, loginSchema } from "@/lib/types";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginForm() {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState<null | string>(null);

  const form = useForm<TLoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  async function onSubmit(data: TLoginSchema) {
    setErrorMessage(null);
    const response = await fetch("/api/auth/login", {
      method: "POST",
      body: JSON.stringify(data),
      redirect: "manual",
    });

    if (response.status === 0) {
      return router.refresh();
    }

    let responseError: unknown;

    if (response.status !== 302) {
      responseError = (await response.json()) as { error: string };

      setErrorMessage((responseError as { error: string }).error);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  placeholder="Username"
                  {...field}
                  className="rounded-none py-6"
                />
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
              <FormControl>
                <Input
                  placeholder="Password"
                  type="password"
                  {...field}
                  className="rounded-none py-6"
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        {errorMessage && (
          <div className="text-sm font-medium text-destructive">
            {errorMessage}
          </div>
        )}
        <Button type="submit" className="w-full rounded-sm" size="lg">
          Submit
        </Button>
      </form>
    </Form>
  );
}
