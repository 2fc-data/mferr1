import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface NewPasswordFormData {
  password: string;
  confirmPassword: string;
}

export const NewPassword: React.FC = () => {
  const { register, handleSubmit, formState: { errors }, watch } = useForm<NewPasswordFormData>();
  const [submissionStatus, setSubmissionStatus] = useState<string | null>(null);

  const onSubmit = async (data: NewPasswordFormData) => {
    if (data.password !== data.confirmPassword) {
      setSubmissionStatus("Passwords do not match");
      return;
    }
    // Logic to update password would go here.
    console.log('Update password:', data);
    setSubmissionStatus('Password update logic to be implemented.');
  };

  const password = watch("password");

  return (
    <div className="p-4 border rounded shadow-md max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">Set New Password</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <Label htmlFor="password">New Password</Label>
          <Input id="password" type="password" {...register('password', { required: true })} />
          {errors.password && <span className="text-red-500">Required</span>}
        </div>
        <div>
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <Input
            id="confirmPassword"
            type="password"
            {...register('confirmPassword', {
              required: true,
              validate: (value) => value === password || "Passwords do not match"
            })}
          />
          {errors.confirmPassword && <span className="text-red-500">{errors.confirmPassword.message}</span>}
        </div>
        <Button type="submit" className="w-full">Update Password</Button>
      </form>
      {submissionStatus && <p className="mt-4 text-center">{submissionStatus}</p>}
    </div>
  );
};
