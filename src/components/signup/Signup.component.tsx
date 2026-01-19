import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { getURI, ENTITIES } from '@/services/getURI';

interface SignupFormData {
  name: string;
  username: string;
  email: string;
  document: string;
  password: string;
  confirmPassword?: string;
}

export const Signup: React.FC = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<SignupFormData>();
  const [submissionStatus, setSubmissionStatus] = useState<string | null>(null);

  const onSubmit = async (data: SignupFormData) => {
    try {
      // Connect to Users creation endpoint
      const response = await fetch(getURI(ENTITIES.USERS), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (response.ok) setSubmissionStatus('User registered successfully!');
      else setSubmissionStatus(`Error: ${response.statusText}`);
    } catch (e) {
      setSubmissionStatus('Error submitting form');
    }
  };

  return (
    <div className="p-4 border rounded shadow-md max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">Sign Up</h2>
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
          <Input id="password" type="password" {...register('password', { required: true })} />
          {errors.password && <span className="text-red-500">Required</span>}
        </div>
        <Button type="submit" className="w-full">Sign Up</Button>
      </form>
      {submissionStatus && <p className="mt-4 text-center">{submissionStatus}</p>}
    </div>
  );
};
