'use client';

import { ColumnDef } from '@tanstack/react-table';
import { CellAction } from './cell-action';
import { Badge } from '@/components/ui/badge';
import { maskEmail } from '@/lib/pii';

export interface ConsentRecord {
  consent_id: string;
  user_id: string;
  agreement_id: string;
  consent_status: 'Opt-in' | 'Opt-out' | string;
  created_at: string;
  updated_at?: string | null;
  User?: {
    name?: string;
    email?: string;
  };
  Agreement?: {
    agreement_name?: string;
  };
}

export const columns: ColumnDef<ConsentRecord>[] = [
  {
    id: 'user',
    header: 'DATA PRINCIPAL',
    cell: ({ row }) => {
      const user = row.original.User;
      return (
        <div className="flex flex-col">
          <span className="font-medium text-foreground">{user?.name || 'Unknown Principal'}</span>
          {user?.email && (
            <span className="font-mono text-xs text-muted-foreground">
              {maskEmail(user.email)}
            </span>
          )}
        </div>
      );
    }
  },
  {
    accessorKey: 'agreement_name',
    header: 'CONSENT AGREEMENT',
    cell: ({ row }) => (
      <span className="font-medium">{row.original.Agreement?.agreement_name || 'N/A'}</span>
    )
  },
  {
    accessorKey: 'consent_status',
    header: 'CONSENT STATUS',
    cell: ({ row }) => {
      const isOptIn = row.original.consent_status === 'Opt-in';
      return (
        <Badge
          variant={isOptIn ? 'default' : 'destructive'}
          className={isOptIn ? 'bg-emerald-600 hover:bg-emerald-700 text-white' : ''}
        >
          {row.original.consent_status}
        </Badge>
      );
    }
  },
  {
    accessorKey: 'created_at',
    header: 'RECORDED AT',
    cell: ({ row }) => {
      const date = new Date(row.original.created_at);
      return (
        <span className="text-xs text-muted-foreground">
          {new Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          }).format(date)}
        </span>
      );
    }
  },
  {
    accessorKey: 'updated_at',
    header: 'LAST UPDATED',
    cell: ({ row }) => {
      if (!row.original.updated_at) return <span className="text-muted-foreground text-xs">-</span>;
      const date = new Date(row.original.updated_at);
      return (
        <span className="text-xs text-muted-foreground">
          {new Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          }).format(date)}
        </span>
      );
    }
  },
  {
    id: 'actions',
    cell: ({ row }) => <CellAction data={row.original} />
  }
];
