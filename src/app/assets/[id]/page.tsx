'use client';
import { useParams, useRouter } from 'next/navigation';
import { assetsData as initialAssetsData } from '@/lib/data';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Edit } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useEffect, useState } from 'react';
import Link from 'next/link';

type Asset = (typeof initialAssetsData)[0];

export default function AssetDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const assetId = params.id as string;
  
  const [asset, setAsset] = useState<Asset | undefined>(undefined);

  useEffect(() => {
    const storedAssets = localStorage.getItem('assetsData');
    const assets: Asset[] = storedAssets ? JSON.parse(storedAssets) : initialAssetsData;
    const currentAsset = assets.find((a) => a.id === assetId);
    setAsset(currentAsset);
  }, [assetId]);
  
  if (!asset) {
    return (
      <div className="flex items-center justify-center h-full">
        <p>Asset not found.</p>
      </div>
    );
  }

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
    <div className="space-y-4">
        <div className="flex justify-end gap-2 mb-4">
             <Button asChild>
                <Link href={`/assets/${assetId}/edit`}>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit Asset
                </Link>
            </Button>
            <Button variant="outline" onClick={() => router.push('/assets')}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to List
            </Button>
        </div>
        <Card className="shadow-lg max-w-4xl mx-auto">
          <CardHeader>
            <div className="flex justify-between items-start">
                <div>
                    <CardTitle className="text-3xl">{asset.name}</CardTitle>
                    <CardDescription>
                        Asset ID: {asset.id}
                    </CardDescription>
                </div>
                 <Badge variant={getStatusBadgeVariant(asset.status)} className="text-lg">
                    {asset.status}
                </Badge>
            </div>
          </CardHeader>
          <CardContent className="grid gap-8">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <div className="space-y-4">
                    <h3 className="font-semibold text-lg border-b pb-2">Details</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <p className="font-medium">Category</p><p>{asset.category}</p>
                        <p className="font-medium">Assigned To</p><p>{asset.assignedTo}</p>
                        <p className="font-medium">Purchase Value</p><p>${asset.value.toFixed(2)}</p>
                    </div>
                </div>
                 <div className="space-y-4">
                    <h3 className="font-semibold text-lg border-b pb-2">Important Dates</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <p className="font-medium">Purchase Date</p><p>{asset.purchaseDate}</p>
                        <p className="font-medium">Warranty End</p><p>{asset.warrantyEndDate || 'N/A'}</p>
                    </div>
                </div>
             </div>
             {asset.notes && (
                  <div className="space-y-2">
                    <h3 className="font-semibold text-lg border-b pb-2">Notes</h3>
                    <p className="text-sm text-muted-foreground">{asset.notes}</p>
                </div>
             )}
          </CardContent>
        </Card>
    </div>
  );
}
