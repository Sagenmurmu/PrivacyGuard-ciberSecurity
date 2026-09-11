'use client';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { AuditLogRecord } from './columns';
import { Copy, MoreHorizontal, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';

interface CellActionProps {
  data: AuditLogRecord;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const onCopyId = () => {
    navigator.clipboard.writeText(data.log_id);
    toast.success('Audit Log ID copied');
  };

  const onCopyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(data, null, 2));
    toast.success('Audit record JSON copied to clipboard');
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
        <DropdownMenuLabel>Audit Options</DropdownMenuLabel>
        <DropdownMenuItem onClick={onCopyId}>
          <Copy className="mr-2 h-4 w-4" /> Copy Log ID
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onCopyJson}>
          <ShieldCheck className="mr-2 h-4 w-4" /> Copy Record JSON
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
