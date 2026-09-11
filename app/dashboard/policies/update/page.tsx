'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import { supabase } from '@/lib/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

function UpdatePolicyContent() {
  const [formData, setFormData] = useState({
    policy_name: '',
    policy_description: '',
    jurisdiction: '',
    industrySector: '',
    shareData: false,
    version: '1.0'
  });
  const [loading, setLoading] = useState(true);

  const searchParams = useSearchParams();
  const policy_id = searchParams.get('policy_id');
  const router = useRouter();

  useEffect(() => {
    if (policy_id) {
      fetchPolicy(policy_id);
    } else {
      setLoading(false);
    }
  }, [policy_id]);

  const fetchPolicy = async (id: string) => {
    setLoading(true);
    const { data, error } = await supabase
      .from('Policy')
      .select('*')
      .eq('policy_id', id)
      .single();

    if (data) {
      setFormData({
        policy_name: data.policy_name || '',
        policy_description: data.policy_description || '',
        jurisdiction: data.jurisdiction || '',
        industrySector: data.industrySector || '',
        shareData: data.shareData || false,
        version: data.version || '1.0',
      });
    }

    if (error) {
      console.error('Error fetching policy:', error);
      toast.error('Failed to load policy.');
    }
    setLoading(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, shareData: e.target.checked });
  };

  const handleUpdatePolicy = async () => {
    if (!policy_id) {
      toast.error('Policy ID is missing.');
      return;
    }

    try {
      const currentVersion = parseFloat(formData.version) || 1.0;
      const newVersion = (currentVersion + 0.1).toFixed(1);

      const updatedPolicy = {
        policy_id, // Preserves the original policy ID
        ...formData,
        version: newVersion,
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase
        .from('Policy')
        .upsert(updatedPolicy, { onConflict: 'policy_id' });

      if (error) {
        console.error('Error updating policy:', error.message);
        toast.error('Failed to update the policy. Please try again.');
      } else {
        toast.success(`Policy updated to version ${newVersion} successfully!`);
        router.push('/dashboard/policies');
      }
    } catch (error) {
      console.error('Unexpected error:', error);
      toast.error('Unexpected error occurred while updating the policy.');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-muted-foreground">Loading policy details...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6">
      <Card className="mx-auto max-w-4xl">
        <CardHeader>
          <CardTitle className="text-left text-2xl font-bold">Edit Privacy Policy</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleUpdatePolicy();
            }}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-1">Policy Name</label>
                <Input
                  name="policy_name"
                  value={formData.policy_name}
                  onChange={handleInputChange}
                  placeholder="Enter policy name"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Jurisdiction</label>
                <Input
                  name="jurisdiction"
                  value={formData.jurisdiction}
                  onChange={handleInputChange}
                  placeholder="e.g. India (DPDP Act)"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Industry Sector</label>
                <Input
                  name="industrySector"
                  value={formData.industrySector}
                  onChange={handleInputChange}
                  placeholder="e.g. Healthcare, Fintech, E-Commerce"
                  required
                />
              </div>
              <div className="flex items-center pt-6">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="shareData"
                    checked={formData.shareData}
                    onChange={handleCheckboxChange}
                    className="h-4 w-4 rounded border-gray-300"
                  />
                  <span className="text-sm font-medium">Share data with third-party Data Processors</span>
                </label>
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium mb-1">Policy Description</label>
                <Textarea
                  name="policy_description"
                  value={formData.policy_description}
                  onChange={handleInputChange}
                  placeholder="Provide comprehensive policy terms aligned with DPDP compliance requirements..."
                  rows={4}
                  required
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t">
              <Button
                type="button"
                variant="secondary"
                onClick={() => router.push('/dashboard/policies')}
              >
                Cancel
              </Button>
              <Button type="submit">Update Policy</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default function UpdatePolicy() {
  return (
    <Suspense fallback={<div className="p-6">Loading...</div>}>
      <UpdatePolicyContent />
    </Suspense>
  );
}
