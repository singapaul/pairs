"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  Library,
  Clock,
  Star,
  FolderEdit,
  BarChart2,
  MessageSquare,
  ExternalLink,
  LucideIcon,
} from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/lib/auth";
import Navigation from "@/components/navigation";

interface SidebarItem {
  title: string;
  href: string;
  icon: LucideIcon;
  external?: boolean;
}

const sidebarItems: SidebarItem[] = [
  {
    title: "Library",
    href: "/decks",
    icon: Library,
  },
  {
    title: "Recently Played",
    href: "/decks/recent",
    icon: Clock,
  },
  {
    title: "Favorites",
    href: "/decks/favorites",
    icon: Star,
  },
];

const authenticatedItems: SidebarItem[] = [
  {
    title: "My Decks",
    href: "/decks/my-decks",
    icon: FolderEdit,
  },
  {
    title: "My Stats",
    href: "/decks/stats",
    icon: BarChart2,
  },
];

export default function DecksLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { user } = useAuth();

  const allSidebarItems = [
    ...sidebarItems,
    ...(user ? authenticatedItems : []),
    {
      title: "Feedback",
      href: "https://docs.google.com/forms/d/1qj9At1Q7msgXO_x_1RXs7dLVtBnRSLxFZjRSs63c698/viewform?edit_requested=true",
      icon: MessageSquare,
      external: true,
    },
  ];

  return (
    <div className="min-h-screen pt-16">
      <Navigation onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)} />
      <div className="flex">
        {/* Sidebar */}
        <div
          className={cn(
            "fixed top-16 bottom-0 left-0 z-40 w-64 transform bg-background border-r transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:inset-auto lg:transform-none",
            isSidebarOpen ? "translate-x-0" : "-translate-x-full",
          )}
        >
          <nav className="p-4 space-y-2">
            {allSidebarItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsSidebarOpen(false)}
                  target={item.external ? "_blank" : undefined}
                  rel={item.external ? "noopener noreferrer" : undefined}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors",
                    isActive
                      ? "bg-gray-100 text-gray-900 font-medium"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-100/50",
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.title}
                  {item.external && (
                    <ExternalLink className="h-3 w-3 ml-auto" />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Backdrop for mobile */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black/20 z-30 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Main content */}
        <div className="flex-1 p-6 lg:p-8">{children}</div>
      </div>
    </div>
  );
}
