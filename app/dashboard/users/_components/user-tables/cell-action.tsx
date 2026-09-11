'use client';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { DataPrincipal } from './columns';
import { Copy, MoreHorizontal, ShieldAlert, History } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

interface CellActionProps {
  data: DataPrincipal;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const router = useRouter();

  const onCopyId = () => {
    navigator.clipboard.writeText(data.user_id);
    toast.success('Data Principal ID copied to clipboard');
  };

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuItem onClick={onCopyId}>
          <Copy className="mr-2 h-4 w-4" /> Copy Principal ID
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => router.push('/dashboard/consent')}>
          <History className="mr-2 h-4 w-4" /> View Consent History
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => router.push('/dashboard/privacy-rights')}>
          <ShieldAlert className="mr-2 h-4 w-4" /> Exercise Privacy Rights
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
