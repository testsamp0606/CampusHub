
'use client';

import { PlaceHolderImages } from '@/lib/placeholder-images';
import Image from 'next/image';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

export default function ProfilePage() {
  const userAvatar = PlaceHolderImages.find((img) => img.id === 'user-avatar-1');

  return (
    <div className="flex justify-center items-start pt-10">
      <Card className="shadow-lg w-full max-w-2xl">
        <CardHeader>
          <div className="flex items-center gap-6">
            <Avatar className="h-24 w-24">
                {userAvatar && (
                    <Image
                    src={userAvatar.imageUrl}
                    alt={userAvatar.description}
                    width={96}
                    height={96}
                    data-ai-hint={userAvatar.imageHint}
                    className="rounded-full"
                    />
                )}
              <AvatarFallback>AD</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-3xl">Admin</CardTitle>
              <CardDescription>admin@stpeters.edu</CardDescription>
               <Badge className="mt-2" variant="secondary">Administrator</Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
           <div className="space-y-4">
            <h3 className="font-semibold text-lg border-b pb-2">Account Details</h3>
            <div className="grid grid-cols-3 gap-4 text-sm">
                <p className="font-medium text-muted-foreground col-span-1">Username</p>
                <p className="col-span-2">admin</p>
                <p className="font-medium text-muted-foreground col-span-1">Last Login</p>
                <p className="col-span-2">{new Date().toLocaleString()}</p>
                <p className="font-medium text-muted-foreground col-span-1">Member Since</p>
                <p className="col-span-2">January 1, 2024</p>
            </div>
        </div>
        </CardContent>
      </Card>
    </div>
  );
}
