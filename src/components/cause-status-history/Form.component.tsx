import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { getURI, ENTITIES } from '@/services/getURI';

interface CauseStatusHistoryFormData {
  cause_id: number;
  status_id: number;
  changed_by: number;
  change_date: string;
}

export const CauseStatusHistoryForm: React.FC = () => {
  const { register, handleSubmit } = useForm<CauseStatusHistoryFormData>();
  const [submissionStatus, setSubmissionStatus] = useState<string | null>(null);

  const onSubmit = async (data: CauseStatusHistoryFormData) => {
    try {
      // Ensure date is ISO string if needed, or backend handles plain string.
      // DTO expects Date, string usually works if valid format.
      const response = await fetch(getURI(ENTITIES.CAUSE_STATUS_HISTORY), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (response.ok) setSubmissionStatus('Status History created!');
      else setSubmissionStatus(`Error: ${response.statusText}`);
    } catch (e) { setSubmissionStatus('Error submitting form'); }
  };

  return (
    <div className="p-4 border rounded shadow-md">
      <h2 className="text-xl font-bold mb-4">Create Status History</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <Label htmlFor="cause_id">Cause ID</Label>
          <Input type="number" id="cause_id" {...register('cause_id', { required: true, valueAsNumber: true })} />
        </div>
        <div>
          <Label htmlFor="status_id">Status ID</Label>
          <Input type="number" id="status_id" {...register('status_id', { required: true, valueAsNumber: true })} />
        </div>
        <div>
          <Label htmlFor="changed_by">Changed By (User ID)</Label>
          <Input type="number" id="changed_by" {...register('changed_by', { required: true, valueAsNumber: true })} />
        </div>
        <div>
          <Label htmlFor="change_date">Date</Label>
          <Input type="datetime-local" id="change_date" {...register('change_date', { required: true })} />
        </div>
        <Button type="submit">Submit</Button>
      </form>
      {submissionStatus && <p className="mt-4">{submissionStatus}</p>}
    </div>
  );
};
