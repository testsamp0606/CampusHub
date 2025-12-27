
'use client';
import React, { useState, useMemo, useEffect } from 'react';
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
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Eye, Search, PlusCircle, Trash2, Edit } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { assetsData as initialAssetsData, Asset } from '@/lib/data';

const ASSETS_PER_PAGE = 5;

export default function AssetsPage() {
  const { toast } = useToast();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [assets, setAssets] = useState<Asset[]>(initialAssetsData);

  const handleDelete = (assetId: string) => {
    const updatedAssets = assets.filter(asset => asset.id !== assetId);
    setAssets(updatedAssets);
    toast({
      title: 'Asset Deleted',
      variant: 'destructive',
      description: `Asset with ID: ${assetId} has been permanently deleted.`,
    });
  };

  const filteredAssets = useMemo(() => {
    return assets.filter(
      (asset) =>
        asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        asset.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        asset.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        asset.assignedTo.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, assets]);

  const totalPages = Math.ceil(filteredAssets.length / ASSETS_PER_PAGE);

  const paginatedAssets = useMemo(() => {
    const startIndex = (currentPage - 1) * ASSETS_PER_PAGE;
    const endIndex = startIndex + ASSETS_PER_PAGE;
    return filteredAssets.slice(startIndex, endIndex);
  }, [filteredAssets, currentPage]);

  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const getStatusBadgeVariant = (status: Asset['status']) => {
    switch (status) {
        case 'In Use': return 'success';
        case 'Under Maintenance': return 'warning';
        case 'In Storage': return 'secondary';
        case 'Disposed': return 'destructive';
        default: return 'outline';
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Asset Management</h1>
        <Button asChild>
          <Link href="/assets/add">
            <PlusCircle className="mr-2 h-4 w-4" /> Add New Asset
          </Link>
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>All School Assets</CardTitle>
          <CardDescription>
            A list of all assets owned by the institution.
          </CardDescription>
          <div className="relative mt-4">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search by name, category, ID, or location..."
              className="w-full rounded-lg bg-background pl-8"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Asset ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Assigned To</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedAssets.map((asset) => (
                  <TableRow key={asset.id}>
                    <TableCell className="font-medium">{asset.id}</TableCell>
                    <TableCell>{asset.name}</TableCell>
                    <TableCell>{asset.category}</TableCell>
                    <TableCell>{asset.assignedTo}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadgeVariant(asset.status)}>
                        {asset.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                         <Button asChild variant="ghost" size="icon" title="View Details">
                            <Link href={`/assets/${asset.id}`}>
                                <Eye className="h-4 w-4" />
                                <span className="sr-only">View</span>
                            </Link>
                        </Button>
                        <Button asChild variant="ghost" size="icon" title="Edit">
                             <Link href={`/assets/${asset.id}/edit`}>
                                <Edit className="h-4 w-4" />
                                <span className="sr-only">Edit</span>
                            </Link>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(asset.id)}
                          className="text-destructive hover:text-destructive"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Delete</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
              ))}
            </TableBody>
          </Table>
           {paginatedAssets.length === 0 && (
            <div className="py-10 text-center text-muted-foreground">
              No assets found.
            </div>
          )}
        </CardContent>
         <CardFooter className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Showing{' '}
            <strong>
              {Math.min((currentPage - 1) * ASSETS_PER_PAGE + 1, filteredAssets.length)}
            </strong>{' '}
            to{' '}
            <strong>
              {Math.min(currentPage * ASSETS_PER_PAGE, filteredAssets.length)}
            </strong>{' '}
            of <strong>{filteredAssets.length}</strong> assets
          </div>
          <div className="flex gap-2">
            <Button
              onClick={handlePreviousPage}
              disabled={currentPage === 1}
              variant="outline"
            >
              Previous
            </Button>
            <Button
              onClick={handleNextPage}
              disabled={currentPage === totalPages || totalPages === 0}
              variant="outline"
            >
              Next
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
