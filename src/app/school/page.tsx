'use client';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

export default function SchoolPage() {
  const { toast } = useToast();

  const handleSave = () => {
    toast({
      title: 'School Details Saved',
      description: 'The school information has been updated successfully.',
    });
  };
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">School Details</h1>
      <Card>
        <CardHeader>
          <CardTitle>Institution Information</CardTitle>
          <CardDescription>
            Manage the core details of your school.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="school-name">School Name</Label>
              <Input id="school-name" defaultValue="St. Peter School" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="academic-year">Current Academic Year</Label>
              <Input id="academic-year" defaultValue="2024-2025" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              defaultValue="123 Education Lane, Knowledge City, 12345"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                defaultValue="contact@stpeters.edu"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input id="phone" defaultValue="123-456-7890" />
            </div>
          </div>
        </CardContent>
      </Card>
      <div className="flex justify-end">
        <Button onClick={handleSave}>Save Changes</Button>
      </div>
    </div>
  );
}
