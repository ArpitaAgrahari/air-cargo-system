"use client";

import Link from "next/link";
import { Button } from "@/components";
import {
  TableProperties,
  Home,
  PlaneTakeoff,
  Plus,
  MapPin,
} from "lucide-react";
import { usePathname } from "next/navigation";

type NavItem = {
  label: string;
  href: string;
  icon?: React.ReactNode;
  variant?: "default" | "secondary" | "ghost";
};

const leftLinks: NavItem[] = [
  { label: "Track Booking", href: "/track", icon: <MapPin className="size-4" /> },
  {
    label: "Bookings",
    href: "/bookings",
    icon: <TableProperties className="size-4" />,
  },
];

const rightActions: NavItem[] = [
//   {
//     label: "Track Booking",
//     href: "/bookings/track",
//     icon: <MapPin className="size-4" />,
//     variant: "secondary",
//   },
  {
    label: "Create Booking",
    href: "/bookings/create",
    icon: <Plus className="size-4" />,
  },
  //   {
  //     label: "Create Flight",
  //     href: "/flights/create",
  //     icon: <Plus className="size-4" />,
  //   },
  //   {
  //     label: "Create User",
  //     href: "/users/create",
  //     icon: <Plus className="size-4" />,
  //   },
];

export default function Navbar() {
  const pathname = usePathname();
  const isActive = (href: string) => pathname === href;
  return (
    <nav className="w-full border-b bg-background">
      <div className="mx-auto flex max-w-screen-2xl items-center justify-between px-4">
        <div className="flex items-center gap-2 border-r py-2 pr-5">
          <Link href="/" className="bg-accent rounded-md p-2">
            <PlaneTakeoff className="size-6" />
          </Link>
        </div>
        <div className="flex items-center gap-2 border-x py-3 px-5">
          {leftLinks.map((item) => (
            <Button
              key={item.href}
              variant={isActive(item.href) ? "secondary" : "ghost"}
              className="flex items-center gap-2"
              size="sm"
            >
              <Link
                key={item.href}
                href={item.href}
                className="text-sm font-medium flex items-center gap-2"
              >
                {item.label}
                {item.icon}
              </Link>
            </Button>
          ))}
        </div>
        <div className="flex items-center gap-2 border-l py-3 pl-5">
          {rightActions.map((item) => (
            <Button
              key={item.href}
              asChild
              size="sm"
              variant={item.variant}
              className="flex items-center gap-2"
            >
              <Link href={item.href}>
                {item.label}
                {item.icon}
              </Link>
            </Button>
          ))}
        </div>
      </div>
    </nav>
  );
}
