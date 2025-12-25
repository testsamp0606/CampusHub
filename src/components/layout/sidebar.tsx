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
  useSidebar,
} from '@/components/ui/sidebar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  LogOut,
  Settings,
  GraduationCap,
  ChevronDown,
  PanelLeftClose,
  PanelLeftOpen,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { NAV_ITEMS, type NavItem } from '@/lib/nav-items';
import { Separator } from '../ui/separator';
import { Button } from '../ui/button';

const renderNavItems = (items: NavItem[], pathname: string, isCollapsed: boolean) => {
  return items.map((item) => {
    const isParentActive = item.subItems
      ? item.subItems.some((sub) => pathname.startsWith(sub.href || ''))
      : false;

    if (item.subItems) {
      if (isCollapsed) {
        return (
          <SidebarMenuItem key={item.label}>
            <Popover>
              <PopoverTrigger asChild>
                <SidebarMenuButton
                  isActive={isParentActive}
                  tooltip={item.label}
                  className="justify-start"
                  asChild
                >
                  <div>
                    <item.icon />
                    <span>{item.label}</span>
                  </div>
                </SidebarMenuButton>
              </PopoverTrigger>
              <PopoverContent
                side="right"
                align="start"
                className="p-1 w-auto bg-sidebar border-sidebar-border"
              >
                <SidebarMenu>
                  {item.subItems.map((subItem) => (
                    <SidebarMenuItem key={subItem.label}>
                      <Link href={subItem.href || '#'} passHref>
                        <SidebarMenuButton
                          isActive={pathname === subItem.href}
                          className="justify-start"
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
              </PopoverContent>
            </Popover>
          </SidebarMenuItem>
        );
      }

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

function SidebarToggle() {
  const { state, toggleSidebar } = useSidebar();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleSidebar}
      className="text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
    >
      {state === 'expanded' ? <PanelLeftClose /> : <PanelLeftOpen />}
    </Button>
  );
}

export default function AppSidebar() {
  const pathname = usePathname();
  const { state } = useSidebar();
  const isCollapsed = state === 'collapsed';

  return (
    <Sidebar
      variant="sidebar"
      collapsible="icon"
      className="hidden border-r border-sidebar-border md:flex"
    >
      <SidebarHeader className="h-16 flex items-center justify-between px-3">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2 text-lg font-bold">
            <GraduationCap className="h-7 w-7 text-primary" />
            <span className="text-sidebar-accent-foreground group-data-[collapsible=icon]:hidden">
              Campus Hub
            </span>
          </Link>
          <div className="group-data-[collapsible=icon]:hidden ml-auto">
            <SidebarToggle />
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="flex-1 p-2">
        <SidebarMenu>{renderNavItems(NAV_ITEMS, pathname, isCollapsed)}</SidebarMenu>
      </SidebarContent>

      <Separator className="my-2" />

      <SidebarFooter className="p-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              tooltip="Settings"
              isActive={pathname === '/settings'}
            >
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
