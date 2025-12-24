'use client';

import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarCollapsible,
  SidebarCollapsibleTrigger,
  SidebarCollapsibleContent,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
} from '@/components/ui/sidebar';
import { LogOut, Settings, GraduationCap, ChevronDown } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { NAV_ITEMS } from '@/lib/nav-items';
import { Separator } from '../ui/separator';

export default function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar
      variant="sidebar"
      collapsible="icon"
      className="hidden border-r border-sidebar-border md:flex"
    >
      <SidebarHeader className="h-16 justify-center">
        <Link
          href="/"
          className="flex items-center gap-2 text-lg font-bold text-primary"
        >
          <GraduationCap className="h-7 w-7 text-primary" />
          <span className="text-primary-foreground group-data-[collapsible=icon]:hidden">
            Campus Hub
          </span>
        </Link>
      </SidebarHeader>

      <SidebarContent className="flex-1 p-2">
        <SidebarMenu>
          {NAV_ITEMS.map((item) => (
            <SidebarMenuItem key={item.label} asChild>
              <SidebarCollapsible>
                <SidebarCollapsibleTrigger asChild>
                  <SidebarMenuButton
                    isActive={pathname.startsWith(item.href)}
                    tooltip={item.label}
                    className="justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <item.icon />
                      <span>{item.label}</span>
                    </div>
                    {item.subItems && (
                      <ChevronDown className="h-4 w-4 text-sidebar-foreground/50 group-data-[collapsible=icon]:hidden data-[state=open]:rotate-180 transition-transform" />
                    )}
                  </SidebarMenuButton>
                </SidebarCollapsibleTrigger>
                {item.subItems && (
                  <SidebarCollapsibleContent>
                    <SidebarMenuSub>
                      {item.subItems.map((subItem) => (
                        <SidebarMenuSubItem key={subItem.href}>
                          <Link href={subItem.href} passHref legacyBehavior>
                             <SidebarMenuSubButton
                              isActive={pathname === subItem.href}
                            >
                              {subItem.label}
                            </SidebarMenuSubButton>
                          </Link>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </SidebarCollapsibleContent>
                )}
              </SidebarCollapsible>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>

      <Separator className="my-2" />

      <SidebarFooter className="p-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip="Settings">
              <Link href="/settings">
                <Settings />
                <span>Settings</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip="Log Out">
              <Link href="/logout">
                <LogOut />
                <span>Log Out</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
