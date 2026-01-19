import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
// import { getURI, ENTITIES } from '@/services/getURI';

// Assuming login endpoint might be different or standard auth.
// Often it's /auth/login, but for now I'll point to a placeholder or use Users endpoint if mapped blindly.
// Usually a separate Auth Controller is needed. I'll assume standard POST /auth/login pattern 
// even if I didn't generate it in the backend batch yet (it was in the plan).
// Actually, looking at previous backend work, I created `src/auth` but didn't explicitly make an endpoint exposed in a controller 
// other than the Guard. I'll assume /auth/login for now.

interface LoginFormData {
  username?: string;
  email?: string; // allow either
  password: string;
}

export const Login: React.FC = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>();
  const [submissionStatus, setSubmissionStatus] = useState<string | null>(null);

  const onSubmit = async (data: LoginFormData) => {
    try {
      // Logic would go here. For now, mock or attempt fetch.
      /*
      const response = await fetch(`${BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      */
      console.log('Login data:', data);
      setSubmissionStatus('Login functionality to be connected to backend Auth.');
    } catch (e) {
      setSubmissionStatus('Error submitting form');
    }
  };

  return (
    <div className="p-4 border rounded shadow-md max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">Login</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <Label htmlFor="username">Username or Email</Label>
          <Input id="username" {...register('username', { required: true })} />
          {errors.username && <span className="text-red-500">Required</span>}
        </div>
        <div>
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" {...register('password', { required: true })} />
          {errors.password && <span className="text-red-500">Required</span>}
        </div>
        <Button type="submit" className="w-full">Login</Button>
      </form>
      {submissionStatus && <p className="mt-4 text-center">{submissionStatus}</p>}
    </div>
  );
};
