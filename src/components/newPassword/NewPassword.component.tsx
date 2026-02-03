import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';

interface NewPasswordFormData {
  password: string;
  confirmPassword: string;
}

interface NewPasswordProps {
  isOpen: boolean;
  onClose: (open: boolean) => void;
  onBackToLogin: () => void;
}

export const NewPassword: React.FC<NewPasswordProps> = ({ isOpen, onClose, onBackToLogin }) => {
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
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] sm:rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-center">Set New Password</DialogTitle>
          <DialogDescription className="text-center">
            Enter your new password below.
          </DialogDescription>
        </DialogHeader>
        <div className="w-full mx-auto p-4">
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
          <div className="flex items-center justify-between mt-6">
            <Button variant="link" onClick={() => onClose(false)} className="text-sm font-medium text-primary hover:underline px-0">
              Voltar pra Home
            </Button>
            <Button variant="link" onClick={onBackToLogin} className="text-sm font-medium text-primary hover:underline px-0">
              Voltar pra Login
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
