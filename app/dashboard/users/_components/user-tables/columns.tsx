'use client';

import { ColumnDef } from '@tanstack/react-table';
import { CellAction } from './cell-action';
import { maskEmail } from '@/lib/pii';

export interface DataPrincipal {
  user_id: string;
  name: string;
  email: string;
  created_at: string;
}

export const columns: ColumnDef<DataPrincipal>[] = [
  {
    accessorKey: 'name',
    header: 'DATA PRINCIPAL',
    cell: ({ row }) => (
      <span className="font-medium text-foreground">{row.original.name || 'Unknown'}</span>
    )
  },
  {
    accessorKey: 'email',
    header: 'PROTECTED EMAIL (PII)',
    cell: ({ row }) => (
      <span className="font-mono text-xs text-muted-foreground">
        {maskEmail(row.original.email)}
      </span>
    )
  },
  {
    accessorKey: 'created_at',
    header: 'ONBOARDED AT',
    cell: ({ row }) => {
      if (!row.original.created_at) return <span className="text-muted-foreground">-</span>;
      const date = new Date(row.original.created_at);
      return (
        <span className="text-xs text-muted-foreground">
          {new Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
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
