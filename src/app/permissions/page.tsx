'use client';
import React, { useState, useMemo, useCallback } from 'react';
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
import {
  roles,
  modules,
  permissionsData as initialPermissionsData,
  Permission,
} from '@/lib/data';
import { useToast } from '@/hooks/use-toast';
import { Save } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function PermissionsPage() {
  const { toast } = useToast();
  const [permissions, setPermissions] = useState(initialPermissionsData);
  const [hasChanges, setHasChanges] = useState(false);

  const handlePermissionChange = useCallback((
    module: string,
    role: string,
    permission: Permission
  ) => {
    setPermissions(prev => {
      const newPermissions = JSON.parse(JSON.stringify(prev));
      const currentPermissions = newPermissions[module]?.[role] || [];
      const permissionIndex = currentPermissions.indexOf(permission);

      if (permissionIndex > -1) {
        currentPermissions.splice(permissionIndex, 1);
      } else {
        currentPermissions.push(permission);
      }

      if (!newPermissions[module]) {
        newPermissions[module] = {};
      }
      newPermissions[module][role] = currentPermissions;

      return newPermissions;
    });
    setHasChanges(true);
  }, []);

  const handleSaveChanges = () => {
    // In a real app, you would save this to a database.
    // For this demo, we can log it to the console.
    console.log('Saving updated permissions:', permissions);
    setHasChanges(false);
    toast({
      title: 'Permissions Updated',
      description:
        'The role-based access control settings have been saved.',
    });
  };

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
            Click a button to grant or revoke a permission.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-1/6 font-semibold text-xs">
                    Module
                  </TableHead>
                  {roles.map(role => (
                    <TableHead
                      key={role}
                      className="text-center font-semibold text-xs"
                    >
                      {role}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {modules.map(module => (
                  <TableRow key={module}>
                    <TableCell className="font-semibold py-1 text-xs">{module}</TableCell>
                    {roles.map(role => (
                      <TableCell key={`${module}-${role}`} className="py-1">
                        <div className="flex justify-center gap-1 md:gap-2 flex-wrap">
                          {permissionTypes.map(pType => {
                            const currentPermissions =
                              permissions[module]?.[role] || [];
                            const hasPermission =
                              currentPermissions.includes(pType);
                            return (
                              <Button
                                key={pType}
                                variant={hasPermission ? 'default' : 'outline'}
                                size="sm"
                                className="w-7 h-7 text-xs"
                                title={permissionLabels[pType]}
                                onClick={() =>
                                  handlePermissionChange(module, role, pType)
                                }
                              >
                                {pType}
                              </Button>
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
