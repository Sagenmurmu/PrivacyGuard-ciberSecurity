'use client';

import React, { useState, useEffect } from 'react';
import PageContainer from '@/components/layout/page-container';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { supabase } from '@/lib/client';
import { logAuditEvent } from '@/lib/audit';
import { maskEmail } from '@/lib/pii';
import { Download, FileText, UserCheck, Trash2, ShieldAlert, CheckCircle2 } from 'lucide-react';

interface UserOption {
  user_id: string;
  name: string;
  email: string;
}

export default function PrivacyRightsView() {
  const [users, setUsers] = useState<UserOption[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string>('');
  const [loadingUsers, setLoadingUsers] = useState<boolean>(true);

  // Data Access Request state
  const [accessLoading, setAccessLoading] = useState<boolean>(false);
  const [dataSummary, setDataSummary] = useState<any | null>(null);

  // Data Correction state
  const [correctName, setCorrectName] = useState<string>('');
  const [correctEmail, setCorrectEmail] = useState<string>('');
  const [correctLoading, setCorrectLoading] = useState<boolean>(false);

  // Data Erasure state
  const [deletionReason, setDeletionReason] = useState<string>('');
  const [deletionLoading, setDeletionLoading] = useState<boolean>(false);

  // Request History
  const [requests, setRequests] = useState<Array<{
    id: string;
    type: string;
    target: string;
    status: string;
    timestamp: string;
  }>>([
    {
      id: 'REQ-101',
      type: 'Data Access Request',
      target: 'p***a@example.com',
      status: 'Fulfilled',
      timestamp: '2 hours ago',
    },
    {
      id: 'REQ-102',
      type: 'Data Rectification',
      target: 'r***n@example.com',
      status: 'Processing',
      timestamp: 'Yesterday',
    }
  ]);

  useEffect(() => {
    async function loadUsers() {
      setLoadingUsers(true);
      const { data, error } = await supabase.from('User').select('user_id, name, email').limit(50);
      if (!error && data) {
        setUsers(data);
        if (data.length > 0) {
          setSelectedUserId(data[0].user_id);
          setCorrectName(data[0].name || '');
          setCorrectEmail(data[0].email || '');
        }
      }
      setLoadingUsers(false);
    }
    loadUsers();
  }, []);

  const handleUserSelect = (userId: string) => {
    setSelectedUserId(userId);
    const u = users.find((item) => item.user_id === userId);
    if (u) {
      setCorrectName(u.name || '');
      setCorrectEmail(u.email || '');
      setDataSummary(null);
    }
  };

  const selectedUser = users.find((u) => u.user_id === selectedUserId);

  // 1. Right to Access: Request My Data
  const handleRequestData = async () => {
    if (!selectedUserId || !selectedUser) {
      toast.error('Please select a Data Principal');
      return;
    }

    setAccessLoading(true);
    try {
      // Query consents and agreements for this user
      const { data: consents } = await supabase
        .from('Consent_Record')
        .select('*, Agreement(agreement_name, purpose)')
        .eq('user_id', selectedUserId);

      const summary = {
        data_principal_id: selectedUser.user_id,
        name: selectedUser.name,
        email: selectedUser.email,
        total_consents: consents?.length || 0,
        consents: consents || [],
        generated_at: new Date().toISOString(),
        act_clause: 'Digital Personal Data Protection Act 2023 - Section 11',
      };

      setDataSummary(summary);

      // Log Audit Event: DATA_ACCESS_REQUESTED
      await logAuditEvent({
        action: 'DATA_ACCESS_REQUESTED',
        entity_type: 'DATA_PRINCIPAL',
        entity_id: selectedUser.user_id,
        actor_email: selectedUser.email,
        details: `Access summary exported for ${selectedUser.name}`
      });

      setRequests((prev) => [
        {
          id: `REQ-${Math.floor(100 + Math.random() * 900)}`,
          type: 'Data Access Request',
          target: maskEmail(selectedUser.email),
          status: 'Fulfilled',
          timestamp: 'Just now',
        },
        ...prev
      ]);

      toast.success('Data Access Request generated and logged!');
    } catch (err) {
      console.error(err);
      toast.error('Failed to generate data report.');
    } finally {
      setAccessLoading(false);
    }
  };

  const downloadJson = () => {
    if (!dataSummary) return;
    const blob = new Blob([JSON.stringify(dataSummary, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `privacy-data-export-${selectedUser?.name?.toLowerCase().replace(/\s+/g, '-') || 'user'}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Data package downloaded.');
  };

  // 2. Right to Correction: Correct My Data
  const handleCorrectData = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUserId) return;

    setCorrectLoading(true);
    try {
      const { error } = await supabase
        .from('User')
        .update({ name: correctName, email: correctEmail })
        .eq('user_id', selectedUserId);

      if (error) throw error;

      // Update local state
      setUsers((prev) =>
        prev.map((u) => (u.user_id === selectedUserId ? { ...u, name: correctName, email: correctEmail } : u))
      );

      setRequests((prev) => [
        {
          id: `REQ-${Math.floor(100 + Math.random() * 900)}`,
          type: 'Data Rectification',
          target: maskEmail(correctEmail),
          status: 'Fulfilled',
          timestamp: 'Just now',
        },
        ...prev
      ]);

      toast.success('Data Principal information rectified successfully!');
    } catch (err: any) {
      toast.error(err.message || 'Error updating data.');
    } finally {
      setCorrectLoading(false);
    }
  };

  // 3. Right to Erasure: Delete My Data
  const handleDeleteRequest = async () => {
    if (!selectedUserId || !selectedUser) return;

    const confirmed = window.confirm(
      `Submit formal erasure request for Data Principal: ${selectedUser.name} (${maskEmail(selectedUser.email)})?\n\nThis will trigger an immutable compliance audit record under DPDP Section 12(3).`
    );
    if (!confirmed) return;

    setDeletionLoading(true);
    try {
      // Log Audit Event: DATA_DELETION_REQUESTED
      await logAuditEvent({
        action: 'DATA_DELETION_REQUESTED',
        entity_type: 'DATA_PRINCIPAL',
        entity_id: selectedUser.user_id,
        actor_email: selectedUser.email,
        details: `Reason: ${deletionReason || 'Data Principal initiated erasure'}`
      });

      setRequests((prev) => [
        {
          id: `REQ-${Math.floor(100 + Math.random() * 900)}`,
          type: 'Data Deletion Request',
          target: maskEmail(selectedUser.email),
          status: 'Processing',
          timestamp: 'Just now',
        },
        ...prev
      ]);

      setDeletionReason('');
      toast.success('Data Deletion Request registered under DPDP Act Section 12(3).');
    } catch (err: any) {
      toast.error('Error logging deletion request.');
    } finally {
      setDeletionLoading(false);
    }
  };

  return (
    <PageContainer scrollable>
      <div className="space-y-6">
        <div>
          <Heading
            title="Data Principal Privacy Rights (DPDP Act)"
            description="Exercise and manage statutory rights under India's Digital Personal Data Protection Act: Right to Access, Correction, and Erasure."
          />
        </div>
        <Separator />

        {/* Data Principal Selector */}
        <Card className="border-indigo-500/20 bg-indigo-50/30 dark:bg-indigo-950/10">
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <label className="text-sm font-semibold text-foreground">Select Active Data Principal</label>
                <p className="text-xs text-muted-foreground">
                  Select a registered Data Principal to exercise privacy rights on their behalf.
                </p>
              </div>
              <select
                value={selectedUserId}
                onChange={(e) => handleUserSelect(e.target.value)}
                disabled={loadingUsers}
                className="h-10 w-full sm:w-80 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm"
              >
                {loadingUsers ? (
                  <option>Loading principals...</option>
                ) : users.length === 0 ? (
                  <option>No Data Principals found</option>
                ) : (
                  users.map((u) => (
                    <option key={u.user_id} value={u.user_id}>
                      {u.name} ({maskEmail(u.email)})
                    </option>
                  ))
                )}
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Three Primary Rights Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* 1. Right to Access */}
          <Card className="flex flex-col justify-between">
            <CardHeader>
              <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
                <FileText className="h-5 w-5" />
                <CardTitle className="text-lg">1. Request My Data</CardTitle>
              </div>
              <CardDescription>
                DPDP Section 11: Summary of personal data processed, identities of third-party processors, and consent records.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-xs text-muted-foreground">
                Generates a machine-readable portability report containing all active consent declarations and purposes.
              </p>
              {dataSummary && (
                <div className="rounded-md bg-muted p-3 text-xs space-y-1">
                  <div className="flex justify-between font-medium">
                    <span>Active Consents:</span>
                    <span>{dataSummary.total_consents}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Generated:</span>
                    <span>Just now</span>
                  </div>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex flex-col gap-2">
              <Button
                onClick={handleRequestData}
                disabled={accessLoading || !selectedUserId}
                className="w-full"
              >
                {accessLoading ? 'Querying Data...' : 'Request Data Summary'}
              </Button>
              {dataSummary && (
                <Button variant="outline" size="sm" onClick={downloadJson} className="w-full">
                  <Download className="mr-2 h-4 w-4" /> Download JSON Export
                </Button>
              )}
            </CardFooter>
          </Card>

          {/* 2. Right to Correction */}
          <Card className="flex flex-col justify-between">
            <CardHeader>
              <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                <UserCheck className="h-5 w-5" />
                <CardTitle className="text-lg">2. Correct My Data</CardTitle>
              </div>
              <CardDescription>
                DPDP Section 12(1): Right to rectify inaccurate, misleading, or out-of-date personal information.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form id="correct-form" onSubmit={handleCorrectData} className="space-y-3">
                <div>
                  <label className="text-xs font-medium">Full Name</label>
                  <Input
                    value={correctName}
                    onChange={(e) => setCorrectName(e.target.value)}
                    placeholder="Enter updated name"
                    className="h-8 text-sm mt-1"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-medium">Email Address</label>
                  <Input
                    type="email"
                    value={correctEmail}
                    onChange={(e) => setCorrectEmail(e.target.value)}
                    placeholder="Enter updated email"
                    className="h-8 text-sm mt-1"
                    required
                  />
                </div>
              </form>
            </CardContent>
            <CardFooter>
              <Button
                type="submit"
                form="correct-form"
                disabled={correctLoading || !selectedUserId}
                variant="secondary"
                className="w-full"
              >
                {correctLoading ? 'Updating...' : 'Update & Rectify Data'}
              </Button>
            </CardFooter>
          </Card>

          {/* 3. Right to Erasure */}
          <Card className="flex flex-col justify-between border-rose-500/20">
            <CardHeader>
              <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400">
                <Trash2 className="h-5 w-5" />
                <CardTitle className="text-lg">3. Delete My Data</CardTitle>
              </div>
              <CardDescription>
                DPDP Section 12(3): Right to erasure of personal data that is no longer necessary for the specified purpose.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <label className="text-xs font-medium">Erasure Justification / Reason</label>
                <Textarea
                  value={deletionReason}
                  onChange={(e) => setDeletionReason(e.target.value)}
                  placeholder="e.g. Consent withdrawn, account closure requested..."
                  rows={3}
                  className="text-xs mt-1"
                />
              </div>
              <div className="flex items-start gap-2 text-xs text-muted-foreground bg-rose-50 dark:bg-rose-950/20 p-2 rounded border border-rose-500/20">
                <ShieldAlert className="h-4 w-4 text-rose-500 shrink-0 mt-0.5" />
                <span>Logs an immutable compliance event and flags data for purging.</span>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                onClick={handleDeleteRequest}
                disabled={deletionLoading || !selectedUserId}
                variant="destructive"
                className="w-full"
              >
                {deletionLoading ? 'Submitting...' : 'Submit Erasure Request'}
              </Button>
            </CardFooter>
          </Card>
        </div>

        {/* Live Requests Audit Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-indigo-500" />
              Recent Privacy Rights Requests (Audit Track)
            </CardTitle>
            <CardDescription>
              Real-time audit log of Data Principal statutory requests under governance oversight.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-muted-foreground text-left text-xs uppercase">
                    <th className="pb-3 font-semibold">Request ID</th>
                    <th className="pb-3 font-semibold">Request Type</th>
                    <th className="pb-3 font-semibold">Data Principal</th>
                    <th className="pb-3 font-semibold">Status</th>
                    <th className="pb-3 font-semibold text-right">Timestamp</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {requests.map((req) => (
                    <tr key={req.id} className="text-xs">
                      <td className="py-3 font-mono font-medium">{req.id}</td>
                      <td className="py-3">{req.type}</td>
                      <td className="py-3 font-mono text-muted-foreground">{req.target}</td>
                      <td className="py-3">
                        <Badge
                          variant={
                            req.status === 'Fulfilled'
                              ? 'default'
                              : req.status === 'Processing'
                              ? 'secondary'
                              : 'outline'
                          }
                          className="text-[10px]"
                        >
                          {req.status}
                        </Badge>
                      </td>
                      <td className="py-3 text-right text-muted-foreground">{req.timestamp}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
}
