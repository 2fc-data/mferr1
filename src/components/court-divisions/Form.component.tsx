import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { getURI, ENTITIES } from '@/services/getURI';

interface CourtDivisionFormData {
  name: string;
  court_id: number;
  is_active?: boolean;
}

export const CourtDivisionForm: React.FC = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<CourtDivisionFormData>();
  const [submissionStatus, setSubmissionStatus] = useState<string | null>(null);

  const onSubmit = async (data: CourtDivisionFormData) => {
    try {
      const response = await fetch(getURI(ENTITIES.COURT_DIVISIONS), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (response.ok) setSubmissionStatus('Court Division created!');
      else setSubmissionStatus(`Error: ${response.statusText}`);
    } catch (e) { setSubmissionStatus('Error submitting form'); }
  };

  return (
    <div className="p-4 border rounded shadow-md">
      <h2 className="text-xl font-bold mb-4">Create Court Division</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <Label htmlFor="name">Name</Label>
          <Input id="name" {...register('name', { required: true })} />
          {errors.name && <span className="text-red-500">Required</span>}
        </div>
        <div>
          <Label htmlFor="court_id">Court ID</Label>
          <Input type="number" id="court_id" {...register('court_id', { required: true, valueAsNumber: true })} />
          {errors.court_id && <span className="text-red-500">Required</span>}
        </div>
        <div className="flex items-center">
          <input type="checkbox" {...register('is_active')} className="mr-2" />
          <Label htmlFor="is_active">Active</Label>
        </div>
        <Button type="submit">Submit</Button>
      </form>
      {submissionStatus && <p className="mt-4">{submissionStatus}</p>}
    </div>
  );
};
