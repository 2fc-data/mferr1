import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { getURI, ENTITIES } from '@/services/getURI';

interface AddressFormData {
  postcode: string;
  city: string;
  state: string;
  district?: string;
  street?: string;
  number?: string;
  complement?: string;
}

export const AddressForm: React.FC = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<AddressFormData>();
  const [submissionStatus, setSubmissionStatus] = useState<string | null>(null);

  const onSubmit = async (data: AddressFormData) => {
    try {
      const response = await fetch(getURI(ENTITIES.ADDRESSES), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (response.ok) setSubmissionStatus('Address created!');
      else setSubmissionStatus(`Error: ${response.statusText}`);
    } catch (e) { setSubmissionStatus('Error submitting form'); }
  };

  return (
    <div className="p-4 border rounded shadow-md">
      <h2 className="text-xl font-bold mb-4">Create Address</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <Label htmlFor="postcode">Postcode</Label>
          <Input id="postcode" {...register('postcode', { required: true })} />
          {errors.postcode && <span className="text-red-500">Required</span>}
        </div>
        <div>
          <Label htmlFor="city">City</Label>
          <Input id="city" {...register('city', { required: true })} />
        </div>
        <div>
          <Label htmlFor="state">State</Label>
          <Input id="state" {...register('state', { required: true })} />
        </div>
        <div>
          <Label htmlFor="street">Street</Label>
          <Input id="street" {...register('street')} />
        </div>
        <div>
          <Label htmlFor="number">Number</Label>
          <Input id="number" {...register('number')} />
        </div>
        <div>
          <Label htmlFor="district">District</Label>
          <Input id="district" {...register('district')} />
        </div>
        <div>
          <Label htmlFor="complement">Complement</Label>
          <Input id="complement" {...register('complement')} />
        </div>
        <Button type="submit">Submit</Button>
      </form>
      {submissionStatus && <p className="mt-4">{submissionStatus}</p>}
    </div>
  );
};
