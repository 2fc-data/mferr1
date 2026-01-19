import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { getURI, ENTITIES } from '@/services/getURI';

interface CauseUserFormData {
  cause_id: number;
  user_id: number;
}

export const CauseUserForm: React.FC = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<CauseUserFormData>();
  const [submissionStatus, setSubmissionStatus] = useState<string | null>(null);

  const onSubmit = async (data: CauseUserFormData) => {
    try {
      const response = await fetch(getURI(ENTITIES.CAUSE_USERS), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (response.ok) setSubmissionStatus('Cause User link created!');
      else setSubmissionStatus(`Error: ${response.statusText}`);
    } catch (e) { setSubmissionStatus('Error submitting form'); }
  };

  return (
    <div className="p-4 border rounded shadow-md">
      <h2 className="text-xl font-bold mb-4">Link User to Cause</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <Label htmlFor="cause_id">Cause ID</Label>
          <Input type="number" id="cause_id" {...register('cause_id', { required: true, valueAsNumber: true })} />
          {errors.cause_id && <span className="text-red-500">Required</span>}
        </div>
        <div>
          <Label htmlFor="user_id">User ID</Label>
          <Input type="number" id="user_id" {...register('user_id', { required: true, valueAsNumber: true })} />
          {errors.user_id && <span className="text-red-500">Required</span>}
        </div>
        <Button type="submit">Submit</Button>
      </form>
      {submissionStatus && <p className="mt-4">{submissionStatus}</p>}
    </div>
  );
};
