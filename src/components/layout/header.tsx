'use client';

import { SidebarTrigger } from '@/components/ui/sidebar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuFooter,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import Image from 'next/image';
import { User, Settings, LogOut, Bell, UserPlus, AlertCircle, FileWarning } from 'lucide-react';
import Link from 'next/link';

export default function Header() {
  const userAvatar = PlaceHolderImages.find((img) => img.id === 'user-avatar-1');

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center gap-4 border-b bg-background px-4 md:px-6">
      <SidebarTrigger className="md:hidden" />
      <div className="flex-1">
        <h1 className="font-headline text-xl font-semibold md:text-2xl">
          Dashboard
        </h1>
      </div>
      <div className="hidden text-right md:block">
        <p className="font-headline font-semibold">St. Peter School</p>
        <p className="text-xs text-muted-foreground">
          Academic Year: 2024-2025
        </p>
      </div>
       <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="relative h-10 w-10 rounded-full">
            <Bell className="h-5 w-5" />
             <span className="absolute top-2 right-2.5 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
            </span>
            <span className="sr-only">Notifications</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-80">
           <DropdownMenuLabel>Notifications</DropdownMenuLabel>
           <DropdownMenuSeparator />
            <DropdownMenuItem className="flex items-start gap-3">
              <UserPlus className="mt-1 h-4 w-4 text-green-500" />
              <div>
                <p className="font-semibold">New student registered</p>
                <p className="text-xs text-muted-foreground">John Doe has been admitted to Class I.</p>
              </div>
            </DropdownMenuItem>
             <DropdownMenuSeparator />
             <DropdownMenuItem className="flex items-start gap-3">
              <FileWarning className="mt-1 h-4 w-4 text-yellow-500" />
              <div>
                <p className="font-semibold">Fee Payment Overdue</p>
                <p className="text-xs text-muted-foreground">Invoice INV003 for Mike Johnson is overdue.</p>
              </div>
            </DropdownMenuItem>
             <DropdownMenuSeparator />
             <DropdownMenuItem className="flex items-start gap-3">
              <AlertCircle className="mt-1 h-4 w-4 text-red-500" />
              <div>
                <p className="font-semibold">Maintenance Alert</p>
                <p className="text-xs text-muted-foreground">Vehicle V003 reported for maintenance.</p>
              </div>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
                <Link href="/notifications" className="justify-center text-sm text-primary">
                    View all notifications
                </Link>
            </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="relative h-10 w-10 rounded-full"
          >
            <Avatar className="h-10 w-10">
              {userAvatar && (
                <Image
                  src={userAvatar.imageUrl}
                  alt={userAvatar.description}
                  width={40}
                  height={40}
                  data-ai-hint={userAvatar.imageHint}
                  className="rounded-full"
                />
              )}
              <AvatarFallback>AD</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">Admin</p>
              <p className="text-xs leading-none text-muted-foreground">
                admin@stpeters.edu
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href="/profile">
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/settings">
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href="#">
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
