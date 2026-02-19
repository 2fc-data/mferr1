import React, { useState } from 'react';
import { useFetch } from '@/hooks/useFetch';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';

import { useNavigate } from 'react-router-dom';

const loginSchema = z.object({
  username: z.string().min(1, { message: 'O campo Username ou email é obrigatório' }),
  password: z.string().min(1, { message: 'O campo Senha é obrigatório' }).min(6, { message: 'A senha deve ter pelo menos 6 caracteres' }),
});

type LoginFormData = z.infer<typeof loginSchema>;

interface LoginProps {
  isOpen?: boolean;
  onClose?: (open: boolean) => void;
  onForgotPassword?: () => void;
}

export const Login: React.FC<LoginProps> = ({
  isOpen = true,
  onClose,
  onForgotPassword
}) => {
  const [submissionStatus, setSubmissionStatus] = useState<string | null>(null);
  const { execute } = useFetch<any>();
  const navigate = useNavigate();

  const handleClose = (open: boolean) => {
    if (onClose) {
      onClose(open);
    } else {
      navigate('/');
    }
  };

  const handleForgotPassword = () => {
    if (onForgotPassword) {
      onForgotPassword();
    } else {
      navigate('/new-password');
    }
  };

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    setSubmissionStatus('Autenticando...');
    try {
      const result = await execute('http://localhost:3000/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (result) {
        localStorage.setItem('token', result.access_token);
        localStorage.setItem('user', JSON.stringify(result.user));
        setSubmissionStatus('Login realizado com sucesso!');
        handleClose(false);
        window.location.href = '/Dashboard';
      }
    } catch (e: any) {
      console.error(e);
      setSubmissionStatus(`Erro: ${e.message || 'Credenciais inválidas'}`);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px] sm:rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">Login</DialogTitle>
          <DialogDescription className="text-center">
            <span className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Área Administrativa</span>
          </DialogDescription>
        </DialogHeader>
        <div className="w-full mx-auto p-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input placeholder="Username ou email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input type="password" placeholder="Senha" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex gap-4">
                <Button type="button" variant="outline" className="flex-1" onClick={() => {
                  form.reset();
                  setSubmissionStatus(null);
                }}>
                  Limpar
                </Button>
                <Button type="submit" className="flex-1">
                  Entrar
                </Button>
              </div>
            </form>
          </Form>
          <div className="flex items-center justify-between mt-6">
            <Button variant="link" onClick={handleForgotPassword} className="text-sm font-medium text-primary hover:underline px-0">
              Esqueceu a senha?
            </Button>
          </div>
          {submissionStatus && (
            <p className="mt-4 text-center text-sm font-medium text-muted-foreground">
              {submissionStatus}
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
