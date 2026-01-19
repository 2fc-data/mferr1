import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { getURI, ENTITIES } from '@/services/getURI';

interface UserFormData {
  name: string;
  username: string;
  document: string;
  email: string;
  password?: string;
  phone1?: string;
  phone2?: string;
  is_active?: boolean;
}

export const UserForm: React.FC = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<UserFormData>();
  const [submissionStatus, setSubmissionStatus] = useState<string | null>(null);

  const onSubmit = async (data: UserFormData) => {
    try {
      const response = await fetch(getURI(ENTITIES.USERS), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (response.ok) setSubmissionStatus('User created!');
      else setSubmissionStatus(`Error: ${response.statusText}`);
    } catch (e) { setSubmissionStatus('Error submitting form'); }
  };

  return (
    <div className="p-4 border rounded shadow-md">
      <h2 className="text-xl font-bold mb-4">Create User</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <Label htmlFor="name">Name</Label>
          <Input id="name" {...register('name', { required: true })} />
          {errors.name && <span className="text-red-500">Required</span>}
        </div>
        <div>
          <Label htmlFor="username">Username</Label>
          <Input id="username" {...register('username', { required: true })} />
          {errors.username && <span className="text-red-500">Required</span>}
        </div>
        <div>
          <Label htmlFor="document">Document</Label>
          <Input id="document" {...register('document', { required: true })} />
          {errors.document && <span className="text-red-500">Required</span>}
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" {...register('email', { required: true })} />
          {errors.email && <span className="text-red-500">Required</span>}
        </div>
        <div>
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" {...register('password')} />
        </div>
        <div>
          <Label htmlFor="phone1">Phone 1</Label>
          <Input id="phone1" {...register('phone1')} />
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
