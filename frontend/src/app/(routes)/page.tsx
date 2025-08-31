"use client";

import { useUserContext } from "@/context/user-context";
import { redirect } from "next/navigation";

export default function Home() {
  const { user, isLoading } = useUserContext();

  if (isLoading) {
    return null;
  }

  if (!user) {
    redirect("/track");
  }

  if (user.role === "CUSTOMER") {
    redirect("/track");
  }

  if (user.role === "STAFF") {
    redirect("/bookings");
  }

  return null;
}