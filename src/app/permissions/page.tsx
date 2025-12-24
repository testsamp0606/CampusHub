'use client';
import React, { useState, useMemo } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { roles, modules, permissionsData as initialPermissionsData, Permission } from '@/lib/data';
import { useToast } from '@/hooks/use-toast';
import { Save } from 'lucide-react';

export default function PermissionsPage() {
    const { toast } = useToast();
    const [permissions, setPermissions] = useState(initialPermissionsData);
    const [hasChanges, setHasChanges] = useState(false);

    const handlePermissionChange = (module: string, role: string, permission: Permission) => {
        setPermissions(prev => {
            const newPermissions = { ...prev };
            const currentPermissions = newPermissions[module]?.[role] || [];
            if (currentPermissions.includes(permission)) {
                newPermissions[module][role] = currentPermissions.filter(p => p !== permission);
            } else {
                newPermissions[module][role] = [...currentPermissions, permission];
            }
            return newPermissions;
        });
        setHasChanges(true);
    };

    const handleSaveChanges = () => {
        // In a real app, you would save this to a database.
        // For this demo, we can log it to the console.
        console.log('Saving updated permissions:', permissions);
        setHasChanges(false);
        toast({
            title: 'Permissions Updated',
            description: 'The role-based access control settings have been saved.',
        });
    }

    const permissionTypes: Permission[] = ['V', 'C', 'E', 'A'];
    const permissionLabels: Record<Permission, string> = {
        V: 'View',
        C: 'Create',
        E: 'Edit',
        A: 'Approve',
    };

    return (
        <div className="flex flex-col gap-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">Permissions Management</h1>
                 {hasChanges && (
                    <Button onClick={handleSaveChanges}>
                        <Save className="mr-2 h-4 w-4" /> Save Changes
                    </Button>
                )}
            </div>

            <Card>
                <CardHeader>
                <CardTitle>Role-Based Access Control</CardTitle>
                <CardDescription>
                    Manage permissions for each user role across different modules.
                </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="border rounded-lg overflow-auto">
                        <Table>
                            <TableHeader>
                            <TableRow>
                                <TableHead className="w-1/6 font-semibold">Module</TableHead>
                                {roles.map(role => (
                                    <TableHead key={role} className="text-center font-semibold">{role}</TableHead>
                                ))}
                            </TableRow>
                            </TableHeader>
                            <TableBody>
                                {modules.map(module => (
                                    <TableRow key={module}>
                                        <TableCell className="font-semibold">{module}</TableCell>
                                        {roles.map(role => (
                                            <TableCell key={`${module}-${role}`} className="text-center">
                                                <div className="flex justify-center gap-2 md:gap-4 flex-wrap">
                                                    {permissionTypes.map(pType => {
                                                        const currentPermissions = permissions[module]?.[role] || [];
                                                        const hasPermission = currentPermissions.includes(pType);
                                                        return (
                                                            <div key={pType} className="flex items-center gap-1.5" title={`${permissionLabels[pType]}`}>
                                                                <Checkbox
                                                                    id={`${module}-${role}-${pType}`}
                                                                    checked={hasPermission}
                                                                    onCheckedChange={() => handlePermissionChange(module, role, pType)}
                                                                />
                                                                <label htmlFor={`${module}-${role}-${pType}`} className="text-xs font-medium cursor-pointer">
                                                                    {pType}
                                                                </label>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
