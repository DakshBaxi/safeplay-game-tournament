"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Calendar, ChevronDown, Grid, LogOut, PlusCircle, Settings, Trophy, Users } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)

  const navigation = [
    {
      name: "Dashboard",
      href: "/",
      icon: Grid,
      current: pathname === "/",
    },
    {
      name: "Tournaments",
      href: "/",
      icon: Trophy,
      current: pathname === "/" || pathname.startsWith("/tournaments"),
    },
    {
      name: "Create Tournament",
      href: "/tournaments/create",
      icon: PlusCircle,
      current: pathname === "/tournaments/create",
    },
    // {
    //   name: "Calendar",
    //   href: "/calendar",
    //   icon: Calendar,
    //   current: pathname === "/calendar",
    // },
    // {
    //   name: "Team Management",
    //   href: "/teams",
    //   icon: Users,
    //   current: pathname === "/teams",
    // },
      // {
      //   name: "Settings",
      //   href: "/settings",
      //   icon: Settings,
      //   current: pathname === "/settings",
      // },
  ]

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <div
        className={cn(
          "bg-card border-r border-border transition-all duration-300 flex flex-col",
          collapsed ? "w-16" : "w-64",
        )}
      >
        <div className="p-4 flex items-center justify-between border-b border-border">
          <div className={cn("flex items-center gap-2", collapsed && "justify-center w-full")}>
            <div className="bg-primary/20 text-primary p-1 rounded">
              <Trophy size={20} />
            </div>
            {!collapsed && <span className="font-bold text-lg">SafePlay</span>}
          </div>
          <Button variant="ghost" size="sm" className={collapsed ? "hidden" : ""} onClick={() => setCollapsed(true)}>
            <ChevronDown className="rotate-90" size={16} />
          </Button>
        </div>
        <div className="flex-1 py-4 flex flex-col gap-1">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-2 text-sm font-medium rounded-md mx-2",
                item.current
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                collapsed && "justify-center px-2",
              )}
            >
              <item.icon size={20} />
              {!collapsed && <span>{item.name}</span>}
            </Link>
          ))}
        </div>
        <div className="p-4 border-t border-border">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="w-full flex items-center gap-2 justify-start">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/placeholder.svg" />
                  <AvatarFallback>TO</AvatarFallback>
                </Avatar>
                {!collapsed && (
                  <>
                    <div className="flex flex-col items-start text-sm">
                      <span className="font-medium">Alex Tournament</span>
                      <span className="text-xs text-muted-foreground">Organizer</span>
                    </div>
                    <ChevronDown className="ml-auto h-4 w-4" />
                  </>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-14 border-b border-border flex items-center px-6 bg-card">
          <div className="flex-1">
            {collapsed && (
              <Button variant="ghost" size="sm" onClick={() => setCollapsed(false)}>
                <ChevronDown className="rotate-270" size={16} />
              </Button>
            )}
          </div>
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm">
              <Trophy className="mr-2 h-4 w-4" />
              <span>Upgrade to Pro</span>
            </Button>
          </div>
        </header>
        <main className="flex-1 overflow-auto p-6">{children}</main>
      </div>
    </div>
  )
}
