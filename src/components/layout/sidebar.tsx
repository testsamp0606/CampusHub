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
  SidebarRail,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { LogOut, Settings, GraduationCap, ChevronDown } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { NAV_ITEMS, type NavItem } from '@/lib/nav-items';
import { Separator } from '../ui/separator';

const renderNavItems = (items: NavItem[], pathname: string) => {
  return items.map((item) => {
    if (item.subItems) {
      const isParentActive = item.subItems.some(sub => pathname.startsWith(sub.href || ''));
      return (
        <SidebarMenuItem key={item.label}>
          <SidebarCollapsible>
            <SidebarCollapsibleTrigger asChild>
                <SidebarMenuButton
                  isActive={isParentActive}
                  tooltip={item.label}
                  className="justify-start"
                  asChild
                >
                  <div>
                    <item.icon />
                    <span>{item.label}</span>
                    <ChevronDown className="ml-auto h-4 w-4 shrink-0 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                  </div>
                </SidebarMenuButton>
            </SidebarCollapsibleTrigger>
            <SidebarCollapsibleContent>
              <SidebarMenu>
                {item.subItems.map((subItem) => (
                  <SidebarMenuItem key={subItem.label}>
                    <Link href={subItem.href || '#'} passHref>
                      <SidebarMenuButton
                        isActive={pathname === subItem.href}
                        tooltip={subItem.label}
                        className="justify-start ml-4"
                        asChild
                      >
                         <div>
                          <subItem.icon />
                          <span>{subItem.label}</span>
                        </div>
                      </SidebarMenuButton>
                    </Link>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarCollapsibleContent>
          </SidebarCollapsible>
        </SidebarMenuItem>
      );
    }

    return (
      <SidebarMenuItem key={item.label}>
        <Link href={item.href || '#'} passHref>
          <SidebarMenuButton
            isActive={pathname === item.href}
            tooltip={item.label}
            className="justify-start"
            asChild
          >
            <div>
              <item.icon />
              <span>{item.label}</span>
            </div>
          </SidebarMenuButton>
        </Link>
      </SidebarMenuItem>
    );
  });
};

export default function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar
      variant="sidebar"
      collapsible="icon"
      className="hidden border-r border-sidebar-border md:flex"
    >
      <SidebarRail>
        <SidebarTrigger className="hidden md:flex" />
      </SidebarRail>
      <SidebarHeader className="h-16 justify-start px-3">
        <Link
          href="/"
          className="flex items-center gap-2 text-lg font-bold"
        >
          <GraduationCap className="h-7 w-7 text-primary" />
          <span className="text-primary-foreground group-data-[collapsible=icon]:hidden">
            Campus Hub
          </span>
        </Link>
      </SidebarHeader>

      <SidebarContent className="flex-1 p-2">
        <SidebarMenu>{renderNavItems(NAV_ITEMS, pathname)}</SidebarMenu>
      </SidebarContent>

      <Separator className="my-2" />

      <SidebarFooter className="p-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip="Settings" isActive={pathname === '/settings'}>
              <Link href="/settings">
                <Settings />
                <span>Settings</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip="Log Out">
              <Link href="#">
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
