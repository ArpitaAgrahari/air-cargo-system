"use client";

import Link from "next/link";
import { Button } from "@/components";
import {
  TableProperties,
  PlaneTakeoff,
  Plus,
  MapPin,
  LogOut,
  Plane,
  Users,
  LogIn,
} from "lucide-react";
import { usePathname } from "next/navigation";
import { authClient } from "@/lib/auth-client";

import { useUserContext } from "@/context/user-context";

type NavItem = {
  label: string;
  href: string;
  icon?: React.ReactNode;
  variant?: "default" | "secondary" | "ghost";
};

export default function Navbar() {
  const pathname = usePathname();
  const isActive = (href: string) => pathname === href;
  const { user } = useUserContext();
  console.log(user);

  const getLeftLinks = (): NavItem[] => {
    const links: NavItem[] = [];

    if (user) {
      if (user.role === "CUSTOMER") {
        links.push({
          label: "Track Booking",
          href: "/track",
          icon: <MapPin className="size-4" />,
        });
        links.push({
          label: "Bookings",
          href: "/bookings",
          icon: <TableProperties className="size-4" />,
        });
      } else if (user.role === "STAFF") {
        links.push({
          label: "Bookings",
          href: "/bookings",
          icon: <TableProperties className="size-4" />,
        });
      } else if (user.role === "ADMIN") {
        links.push({
          label: "Bookings",
          href: "/bookings",
          icon: <TableProperties className="size-4" />,
        });
      }
    }

    return links;
  };

  const getRightActions = (): NavItem[] => {
    const actions: NavItem[] = [];

    if (user) {
      if (user.role === "CUSTOMER") {
        actions.push({
          label: "Create Booking",
          href: "/bookings/create",
          icon: <Plus className="size-4" />,
        });
      } else if (user.role === "ADMIN") {
        actions.push(
          {
            label: "Create Flight",
            href: "/flights/create",
            icon: <Plane className="size-4" />,
          },
          {
            label: "Create User",
            href: "/users/create",
            icon: <Users className="size-4" />,
          }
        );
      }
    } else {
      actions.push({
        label: "Login",
        href: "/login",
        icon: <LogIn className="size-4" />,
      });
    }

    return actions;
  };

  const leftLinks = getLeftLinks();
  const rightActions = getRightActions();

  const signOut = () => {
    authClient.signOut();
    window.location.href = "/";
  };

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
        <div className="flex items-center gap-2">
          {rightActions.length > 0 && (
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
          )}
          {user && (
            <Button variant="outline" size="sm" onClick={signOut}>
              <LogOut className="size-4" />
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
}
