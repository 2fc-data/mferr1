import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { getURI, ENTITIES } from '@/services/getURI';

interface UserSessionFormData {
  user_id: number;
  device_info?: string;
  ip_address?: string;
  user_agent?: string;
}

export const UserSessionForm: React.FC = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<UserSessionFormData>();
  const [submissionStatus, setSubmissionStatus] = useState<string | null>(null);

  const onSubmit = async (data: UserSessionFormData) => {
    try {
      const response = await fetch(getURI(ENTITIES.USER_SESSIONS), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (response.ok) setSubmissionStatus('User Session created!');
      else setSubmissionStatus(`Error: ${response.statusText}`);
    } catch (e) { setSubmissionStatus('Error submitting form'); }
  };

  return (
    <div className="p-4 border rounded shadow-md">
      <h2 className="text-xl font-bold mb-4">Create User Session</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <Label htmlFor="user_id">User ID</Label>
          <Input type="number" id="user_id" {...register('user_id', { required: true, valueAsNumber: true })} />
          {errors.user_id && <span className="text-red-500">Required</span>}
        </div>
        <div>
          <Label htmlFor="device_info">Device Info</Label>
          <Input id="device_info" {...register('device_info')} />
        </div>
        <div>
          <Label htmlFor="ip_address">IP Address</Label>
          <Input id="ip_address" {...register('ip_address')} />
        </div>
        <Button type="submit">Submit</Button>
      </form>
      {submissionStatus && <p className="mt-4">{submissionStatus}</p>}
    </div>
  );
};
