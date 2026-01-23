import { useState, useEffect } from 'react';
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
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Checkbox } from '@/components/ui/checkbox';
import { getURI, ENTITIES } from '@/services/getURI';

const userSchema = z.object({
  name: z.string().min(1, { message: 'O campo Nome é obrigatório' }),
  username: z.string().min(1, { message: 'O campo Username é obrigatório' }),
  document: z.string().min(1, { message: 'O campo Documento é obrigatório' }),
  email: z.string().email({ message: 'E-mail inválido' }).min(1, { message: 'O campo E-mail é obrigatório' }),
  password: z.string().optional(),
  phone1: z.string().optional(),
  phone2: z.string().optional(),
  is_active: z.boolean(),
});

type UserFormData = z.infer<typeof userSchema>;

export const Users = () => {
  const [submissionStatus, setSubmissionStatus] = useState<string | null>(null);
  const [validData, setValidData] = useState<UserFormData | null>(null);

  const form = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: '',
      username: '',
      document: '',
      email: '',
      password: '',
      phone1: '',
      phone2: '',
      is_active: true,
    },
  });

  useEffect(() => {
    if (validData) {
      const submitData = async () => {
        try {
          setSubmissionStatus('Enviando...');
          const response = await fetch(getURI(ENTITIES.USERS), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(validData),
          });

          if (response.ok) {
            setSubmissionStatus('Usuário criado com sucesso!');
            form.reset();
            setValidData(null);
          } else {
            setSubmissionStatus(`Erro: ${response.statusText}`);
            setValidData(null);
          }
        } catch (e) {
          setSubmissionStatus('Erro ao enviar formulário');
          setValidData(null);
        }
      };

      submitData();
    }
  }, [validData, form]);

  const onSubmit = (data: UserFormData) => {
    setValidData(data);
  };

  return (
    <div className="flex items-center justify-center w-full min-h-[calc(100vh-120px)] h-full p-4 overflow-y-auto">
      <div className="p-6 border rounded-lg shadow-lg bg-card text-card-foreground w-full max-w-2xl mx-auto my-auto">
        <h2 className="text-2xl font-bold mb-6 text-center">Criar Usuário</h2>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome</FormLabel>
                    <FormControl>
                      <Input placeholder="Nome completo" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input placeholder="usuário" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="document"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Documento (CPF/CNPJ)</FormLabel>
                    <FormControl>
                      <Input placeholder="000.000.000-00" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>E-mail</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="email@exemplo.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Senha</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="Mínimo 6 caracteres" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="phone1"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Telefone 1</FormLabel>
                    <FormControl>
                      <Input placeholder="(00) 00000-0000" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="phone2"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Telefone 2</FormLabel>
                    <FormControl>
                      <Input placeholder="(00) 00000-0000" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="is_active"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-4 border rounded-md">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Usuário Ativo</FormLabel>
                    </div>
                  </FormItem>
                )}
              />
            </div>

            <div className="flex gap-4 pt-4">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => {
                  form.reset();
                  setSubmissionStatus(null);
                  setValidData(null);
                }}
              >
                Limpar
              </Button>
              <Button type="submit" className="flex-1">
                Salvar
              </Button>
            </div>
          </form>
        </Form>
        {submissionStatus && (
          <p className="mt-4 text-center text-sm font-medium text-muted-foreground">
            {submissionStatus}
          </p>
        )}
      </div>
    </div>
  );
};
