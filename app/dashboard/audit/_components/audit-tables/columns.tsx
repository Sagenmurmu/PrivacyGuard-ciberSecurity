'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import { maskEmail } from '@/lib/pii';
import { CellAction } from './cell-action';

export interface AuditLogRecord {
  log_id: string;
  action: string;
  entity_type?: string;
  entity_id?: string;
  email?: string;
  agreement_name?: string;
  consent_status?: string;
  created_at: string;
}

export const columns: ColumnDef<AuditLogRecord>[] = [
  {
    accessorKey: 'action',
    header: 'COMPLIANCE ACTION',
    cell: ({ row }) => {
      const action = row.original.action || 'EVENT';
      let badgeStyle = 'bg-zinc-700 text-white';

      if (action === 'LOGIN') {
        badgeStyle = 'bg-blue-600 hover:bg-blue-700 text-white';
      } else if (action === 'CONSENT_GRANTED') {
        badgeStyle = 'bg-emerald-600 hover:bg-emerald-700 text-white';
      } else if (action === 'CONSENT_REVOKED') {
        badgeStyle = 'bg-rose-600 hover:bg-rose-700 text-white';
      } else if (action === 'DATA_ACCESS_REQUESTED') {
        badgeStyle = 'bg-indigo-600 hover:bg-indigo-700 text-white';
      } else if (action === 'DATA_DELETION_REQUESTED') {
        badgeStyle = 'bg-amber-600 hover:bg-amber-700 text-white';
      }

      return (
        <Badge className={`font-mono text-[11px] ${badgeStyle}`}>
          {action}
        </Badge>
      );
    }
  },
  {
    accessorKey: 'entity_type',
    header: 'ENTITY SCOPE',
    cell: ({ row }) => (
      <span className="text-xs font-semibold uppercase text-muted-foreground">
        {row.original.entity_type || 'DATA_PRINCIPAL'}
      </span>
    )
  },
  {
    accessorKey: 'email',
    header: 'DATA PRINCIPAL',
    cell: ({ row }) => (
      <span className="font-mono text-xs text-foreground">
        {row.original.email ? maskEmail(row.original.email) : 'System / Anonymous'}
      </span>
    )
  },
  {
    accessorKey: 'agreement_name',
    header: 'AGREEMENT / TARGET',
    cell: ({ row }) => (
      <span className="text-xs text-muted-foreground">
        {row.original.agreement_name || 'N/A'}
      </span>
    )
  },
  {
    accessorKey: 'consent_status',
    header: 'CONSENT STATE',
    cell: ({ row }) => {
      const status = row.original.consent_status;
      if (!status || status === 'N/A') return <span className="text-xs text-muted-foreground">-</span>;
      return (
        <Badge variant={status === 'Opt-in' ? 'default' : 'outline'} className="text-[10px]">
          {status}
        </Badge>
      );
    }
  },
  {
    accessorKey: 'created_at',
    header: 'TIMESTAMP',
    cell: ({ row }) => {
      if (!row.original.created_at) return <span className="text-xs text-muted-foreground">-</span>;
      const date = new Date(row.original.created_at);
      return (
        <span className="text-xs text-muted-foreground font-mono">
          {new Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
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
