'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ConsentRecord } from './columns';
import { Copy, Eye, MoreHorizontal, RefreshCw, XCircle, CheckCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/client';
import { logAuditEvent } from '@/lib/audit';
import { toast } from 'sonner';

interface CellActionProps {
  data: ConsentRecord;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const onCopyId = () => {
    navigator.clipboard.writeText(data.consent_id);
    toast.success('Consent Record ID copied');
  };

  const handleToggleConsent = async () => {
    setLoading(true);
    const nextStatus = data.consent_status === 'Opt-in' ? 'Opt-out' : 'Opt-in';
    try {
      const { error } = await supabase
        .from('Consent_Record')
        .update({
          consent_status: nextStatus,
          updated_at: new Date().toISOString(),
        })
        .eq('consent_id', data.consent_id);

      if (error) throw error;

      await logAuditEvent({
        action: nextStatus === 'Opt-in' ? 'CONSENT_GRANTED' : 'CONSENT_REVOKED',
        entity_type: 'CONSENT_RECORD',
        entity_id: data.agreement_id,
        consent_status: nextStatus,
        details: `Consent status changed to ${nextStatus} for Consent ID ${data.consent_id}`,
      });

      toast.success(`Consent status updated to ${nextStatus}`);
      router.refresh();
    } catch (err: any) {
      toast.error(err.message || 'Failed to update consent status');
    } finally {
      setLoading(false);
    }
  };

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0" disabled={loading}>
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Consent Actions</DropdownMenuLabel>
        <DropdownMenuItem onClick={onCopyId}>
          <Copy className="mr-2 h-4 w-4" /> Copy Consent ID
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => router.push(`/dashboard/agreement/view?agreement_id=${data.agreement_id}`)}
        >
          <Eye className="mr-2 h-4 w-4" /> View Agreement
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleToggleConsent} disabled={loading}>
          {data.consent_status === 'Opt-in' ? (
            <>
              <XCircle className="mr-2 h-4 w-4 text-rose-500" />
              <span>Revoke Consent (Opt-out)</span>
            </>
          ) : (
            <>
              <CheckCircle className="mr-2 h-4 w-4 text-emerald-500" />
              <span>Grant Consent (Opt-in)</span>
            </>
          )}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
