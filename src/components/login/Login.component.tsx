import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';

const loginSchema = z.object({
  username: z.string().min(1, { message: 'O campo Username ou email é obrigatório' }),
  password: z.string().min(1, { message: 'O campo Senha é obrigatório' }).min(6, { message: 'A senha deve ter pelo menos 6 caracteres' }),
});

type LoginFormData = z.infer<typeof loginSchema>;

export const Login: React.FC = () => {
  const [submissionStatus, setSubmissionStatus] = useState<string | null>(null);
  const [validData, setValidData] = useState<LoginFormData | null>(null);

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  });

  // useEffect triggers when validData is set (only after successful form validation)
  useEffect(() => {
    if (validData) {
      const performLogin = async () => {
        try {
          console.log('Performing login with:', validData);
          setSubmissionStatus('Autenticando...');

          // Mocking API call
          await new Promise(resolve => setTimeout(resolve, 1000));

          setSubmissionStatus('Funcionalidade de login aguardando conexão com o backend.');
          setValidData(null); // Reset validData after attempt
        } catch (e) {
          setSubmissionStatus('Erro ao realizar login.');
          setValidData(null);
        }
      };

      performLogin();
    }
  }, [validData]);

  const onSubmit = (data: LoginFormData) => {
    // This is called only if form is valid. 
    // Data is already typed and validated here.
    setValidData(data);
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-120px)] h-full overflow-y-scroll">
      <div className="align-center rounded-lg shadow-lg w-full max-w-md mx-auto p-9 bg-card text-card-foreground">
        <h2 className="text-2xl font-bold mb-3 text-center">Login</h2>
        <h2 className="text-sm font-bold mb-6 text-center text-muted-foreground uppercase tracking-wider">Área Administrativa</h2>
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
                setValidData(null);
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
          <Link to="/" className="text-sm font-medium text-primary hover:underline">
            Voltar pra Home
          </Link>
          <Link to="/new-password" className="text-sm font-medium text-primary hover:underline">
            Esqueceu a senha?
          </Link>
        </div>
        {submissionStatus && (
          <p className="mt-4 text-center text-sm font-medium text-muted-foreground">
            {submissionStatus}
          </p>
        )}
      </div>
    </div>
  );
};
