
'use client';

import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
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
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { NAV_ITEMS, type NavItem } from '@/lib/nav-items';
import { Separator } from '../ui/separator';
import { Button } from '../ui/button';

const renderNavItems = (items: NavItem[], pathname: string, isCollapsed: boolean) => {
  const navGroups = items.reduce(
    (acc, item) => {
      if (item.subItems) {
        acc.collapsible.push(item);
      } else {
        acc.links.push(item);
      }
      return acc;
    },
    { collapsible: [] as NavItem[], links: [] as NavItem[] }
  );

  return (
    <>
      {navGroups.links.map((item) => (
        <SidebarMenuItem key={item.label}>
          <Link href={item.href || '#'} passHref>
            <SidebarMenuButton
              isActive={pathname === item.href}
              tooltip={item.label}
              className="justify-start group-data-[collapsible=icon]:justify-center"
              asChild
            >
              <div>
                <item.icon />
                <span className="group-data-[collapsible=icon]:hidden">{item.label}</span>
              </div>
            </SidebarMenuButton>
          </Link>
        </SidebarMenuItem>
      ))}
      <Accordion type="single" collapsible className="w-full">
        {navGroups.collapsible.map((item) => {
          const isParentActive = item.subItems!.some((sub) => pathname.startsWith(sub.href || ''));
          if (isCollapsed) {
            return (
              <SidebarMenuItem key={item.label}>
                <Popover>
                  <PopoverTrigger asChild>
                    <SidebarMenuButton
                      isActive={isParentActive}
                      tooltip={item.label}
                      className="justify-center"
                      asChild
                    >
                      <div>
                        <item.icon />
                        <span className="sr-only">{item.label}</span>
                      </div>
                    </SidebarMenuButton>
                  </PopoverTrigger>
                  <PopoverContent
                    side="right"
                    align="start"
                    className="p-1 w-auto bg-sidebar-accent border-sidebar-border"
                  >
                    <SidebarMenu>
                      {item.subItems!.map((subItem) => (
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
            <AccordionItem value={item.label} key={item.label} className="border-none">
              <AccordionTrigger
                isActive={isParentActive}
                className="[&_svg:last-child]:data-[state=open]:rotate-180"
              >
                  <item.icon />
                  <span>{item.label}</span>
              </AccordionTrigger>
              <AccordionContent className="ml-4 pl-2 border-l border-sidebar-border">
                <SidebarMenu>
                  {item.subItems!.map((subItem) => (
                    <SidebarMenuItem key={subItem.label}>
                      <Link href={subItem.href || '#'} passHref>
                        <SidebarMenuButton
                          isActive={pathname === subItem.href}
                          tooltip={subItem.label}
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
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>
    </>
  );
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
        <div className="flex items-center gap-2 w-full">
          <Link href="/" className="flex items-center gap-2 text-lg font-bold">
            <GraduationCap className="h-7 w-7 text-primary" />
          </Link>
          <span className="text-sidebar-accent-foreground group-data-[collapsible=icon]:hidden">
              Campus Hub
          </span>
          <div className="ml-auto">
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
              className="justify-start group-data-[collapsible=icon]:justify-center"
            >
              <Link href="/settings">
                <Settings />
                <span className="group-data-[collapsible=icon]:hidden">Settings</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip="Log Out" className="justify-start group-data-[collapsible=icon]:justify-center">
              <Link href="#">
                <LogOut />
                <span className="group-data-[collapsible=icon]:hidden">Log Out</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
