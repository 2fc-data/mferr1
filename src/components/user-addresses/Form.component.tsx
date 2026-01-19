import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { getURI, ENTITIES } from '@/services/getURI';

interface UserAddressFormData {
  user_id: number;
  address_id: number;
  address_type?: string;
  is_primary?: boolean;
}

export const UserAddressForm: React.FC = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<UserAddressFormData>();
  const [submissionStatus, setSubmissionStatus] = useState<string | null>(null);

  const onSubmit = async (data: UserAddressFormData) => {
    try {
      const response = await fetch(getURI(ENTITIES.USER_ADDRESSES), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (response.ok) setSubmissionStatus('User Address created!');
      else setSubmissionStatus(`Error: ${response.statusText}`);
    } catch (e) { setSubmissionStatus('Error submitting form'); }
  };

  return (
    <div className="p-4 border rounded shadow-md">
      <h2 className="text-xl font-bold mb-4">Create User Address</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <Label htmlFor="user_id">User ID</Label>
          <Input type="number" id="user_id" {...register('user_id', { required: true, valueAsNumber: true })} />
          {errors.user_id && <span className="text-red-500">Required</span>}
        </div>
        <div>
          <Label htmlFor="address_id">Address ID</Label>
          <Input type="number" id="address_id" {...register('address_id', { required: true, valueAsNumber: true })} />
          {errors.address_id && <span className="text-red-500">Required</span>}
        </div>
        <div>
          <Label htmlFor="address_type">Type</Label>
          <Input id="address_type" {...register('address_type')} />
        </div>
        <div className="flex items-center">
          <input type="checkbox" {...register('is_primary')} className="mr-2" />
          <Label htmlFor="is_primary">Primary</Label>
        </div>
        <Button type="submit">Submit</Button>
      </form>
      {submissionStatus && <p className="mt-4">{submissionStatus}</p>}
    </div>
  );
};
