"use client";

import React, { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { LogIn, PlaneTakeoff } from "lucide-react";
import { toast, Toaster } from "sonner";
import { cn } from "@/lib/utils";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type FormValues = z.infer<typeof loginSchema>;

export function LoginPage() {
  const [isPending, setIsPending] = useState(false);
  const methods = useForm<FormValues>({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
  });
  const { register, handleSubmit, formState, trigger } = methods;

  const onSubmit = handleSubmit(async (values) => {
    const ok = await trigger();
    if (!ok) return;

    setIsPending(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsPending(false);

    if (values.email === "test@example.com" && values.password === "password123") {
      toast.success("Login Successful", {
        description: `Welcome back, ${values.email}.`,
      });
    } else {
      toast.error("Login Failed", {
        description: "Invalid email or password.",
      });
    }
  });

  return (
    <div className="flex justify-center items-center h-screen bg-gray-50 dark:bg-gray-950">
      <FormProvider {...methods}>
        <form onSubmit={onSubmit} className="w-full max-w-md p-4">
          <Card className="rounded-2xl shadow-xl">
            <CardHeader className="text-center">
              <div className="flex items-center justify-center mb-2">
                <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-full">
                  <PlaneTakeoff className="size-6 text-blue-600 dark:text-blue-300" />
                </div>
              </div>
              <CardTitle className="text-2xl font-bold">Log In</CardTitle>
              <CardDescription>
                Enter your credentials to access your account.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                  Email
                </label>
                <Input
                  type="email"
                  placeholder="name@example.com"
                  {...register("email")}
                  className="rounded-lg"
                />
                {formState.errors.email && (
                  <p className="text-xs text-red-600 mt-1">
                    {formState.errors.email.message as string}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                  Password
                </label>
                <Input
                  type="password"
                  placeholder="••••••••"
                  {...register("password")}
                  className="rounded-lg"
                />
                {formState.errors.password && (
                  <p className="text-xs text-red-600 mt-1">
                    {formState.errors.password.message as string}
                  </p>
                )}
              </div>
              <Button
                type="submit"
                className="w-full rounded-lg transition-all duration-200 hover:scale-105"
                disabled={isPending}
              >
                {isPending ? (
                  "Logging In..."
                ) : (
                  <span className="inline-flex items-center gap-2">
                    Log In
                  </span>
                )}
              </Button>
              <div className="text-center text-sm text-gray-500 dark:text-gray-400 mt-4">
                Don't have an account?{" "}
                <a href="#" className="font-semibold text-blue-600 hover:underline">
                  Sign Up
                </a>
              </div>
            </CardContent>
          </Card>
        </form>
      </FormProvider>
      <Toaster position="bottom-center" />
    </div>
  );
}