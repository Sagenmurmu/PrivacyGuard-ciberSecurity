'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import { supabase } from '@/lib/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

function UpdateAgreementContent() {
  const [formData, setFormData] = useState({
    agreement_name: '',
    policy_id: '',
    purpose: '',
    purpose_description: '',
    agreement_duration: '',
    version: '1.0',
    is_active: true,
    data_attributes: [{ name: '', description: '' }],
  });
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();
  const agreement_id = searchParams.get('agreement_id');
  const router = useRouter();

  useEffect(() => {
    if (agreement_id) {
      fetchAgreement(agreement_id);
    } else {
      setLoading(false);
    }
  }, [agreement_id]);

  const fetchAgreement = async (id: string) => {
    setLoading(true);
    const { data, error } = await supabase
      .from('Agreement')
      .select('*')
      .eq('agreement_id', id)
      .single();

    if (data) {
      setFormData({
        agreement_name: data.agreement_name || '',
        policy_id: data.policy_id || '',
        purpose: data.purpose || '',
        purpose_description: data.purpose_description || '',
        agreement_duration: data.agreement_duration || '',
        version: data.version || '1.0',
        is_active: data.is_active ?? true,
        data_attributes: Array.isArray(data.data_attributes) && data.data_attributes.length > 0
          ? data.data_attributes
          : [{ name: '', description: '' }],
      });
    }

    if (error) {
      console.error('Error fetching agreement:', error);
      toast.error('Failed to load agreement data.');
    }
    setLoading(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const target = e.target;
    const { name, value } = target;
    const checked = (target as HTMLInputElement).checked;
    setFormData((prev) => ({
      ...prev,
      [name]: (target as HTMLInputElement).type === 'checkbox' ? checked : value,
    }));
  };

  const handleDataAttributeChange = (index: number, field: string, value: string) => {
    const updatedAttributes = [...formData.data_attributes];
    updatedAttributes[index] = { ...updatedAttributes[index], [field]: value };
    setFormData((prev) => ({
      ...prev,
      data_attributes: updatedAttributes,
    }));
  };

  const addDataAttribute = () => {
    setFormData((prev) => ({
      ...prev,
      data_attributes: [...prev.data_attributes, { name: '', description: '' }],
    }));
  };

  const removeDataAttribute = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      data_attributes: prev.data_attributes.filter((_, i) => i !== index),
    }));
  };

  const handleUpdateAgreement = async () => {
    if (!agreement_id) {
      toast.error('Agreement ID missing.');
      return;
    }

    try {
      const currentVer = parseFloat(formData.version) || 1.0;
      const newVersion = (currentVer + 0.1).toFixed(1);

      const updatedAgreement = {
        agreement_id, // Preserves the existing agreement ID
        ...formData,
        version: newVersion,
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase
        .from('Agreement')
        .upsert(updatedAgreement, { onConflict: 'agreement_id' });

      if (error) {
        console.error('Error updating agreement:', error.message);
        toast.error('Failed to update agreement.');
      } else {
        toast.success(`Agreement updated to version ${newVersion} successfully!`);
        router.push('/dashboard/agreement');
      }
    } catch (error) {
      console.error('Unexpected error:', error);
      toast.error('Unexpected error occurred while updating agreement.');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-muted-foreground">Loading agreement details...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6">
      <Card className="mx-auto max-w-4xl">
        <CardHeader>
          <CardTitle className="text-left text-2xl font-bold">Edit Consent Agreement</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleUpdateAgreement();
            }}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-1">Agreement Name</label>
                <Input
                  name="agreement_name"
                  value={formData.agreement_name}
                  onChange={handleInputChange}
                  placeholder="Enter agreement name"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Associated Policy ID</label>
                <Input
                  name="policy_id"
                  value={formData.policy_id}
                  onChange={handleInputChange}
                  placeholder="Enter associated policy ID"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Purpose of Processing</label>
                <Input
                  name="purpose"
                  value={formData.purpose}
                  onChange={handleInputChange}
                  placeholder="e.g. Account Creation, Analytics"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Agreement Duration</label>
                <Input
                  name="agreement_duration"
                  value={formData.agreement_duration}
                  onChange={handleInputChange}
                  placeholder="e.g. 12 months, Indefinite"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium mb-1">Purpose Description</label>
                <Textarea
                  name="purpose_description"
                  value={formData.purpose_description}
                  onChange={handleInputChange}
                  placeholder="Explain why this data is collected and how it will be processed..."
                  rows={3}
                  required
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="is_active"
                name="is_active"
                checked={formData.is_active}
                onChange={handleInputChange}
                className="h-4 w-4 rounded border-gray-300"
              />
              <label htmlFor="is_active" className="text-sm font-medium">
                Active Agreement (Visible to Data Principals)
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Data Principal Attributes Requested</label>
              <div className="space-y-3">
                {formData.data_attributes.map((attr, index) => (
                  <div key={index} className="flex gap-2 items-center">
                    <Input
                      placeholder="Attribute Name (e.g. Email, Location)"
                      value={attr.name}
                      onChange={(e) => handleDataAttributeChange(index, 'name', e.target.value)}
                      className="flex-1"
                    />
                    <Input
                      placeholder="Attribute Description / Justification"
                      value={attr.description}
                      onChange={(e) => handleDataAttributeChange(index, 'description', e.target.value)}
                      className="flex-1"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => removeDataAttribute(index)}
                      disabled={formData.data_attributes.length <= 1}
                    >
                      Remove
                    </Button>
                  </div>
                ))}
              </div>
              <Button type="button" variant="outline" size="sm" onClick={addDataAttribute} className="mt-3">
                + Add Data Attribute
              </Button>
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t">
              <Button
                type="button"
                variant="secondary"
                onClick={() => router.push('/dashboard/agreement')}
              >
                Cancel
              </Button>
              <Button type="submit">Update Agreement</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default function UpdateAgreement() {
  return (
    <Suspense fallback={<div className="p-6">Loading...</div>}>
      <UpdateAgreementContent />
    </Suspense>
  );
}
