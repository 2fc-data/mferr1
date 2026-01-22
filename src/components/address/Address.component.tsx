import React, { useState, useEffect } from 'react';
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
import { getURI, ENTITIES } from '@/services/getURI';

const addressSchema = z.object({
  postcode: z.string().min(1, { message: 'O campo CEP é obrigatório' }),
  city: z.string().min(1, { message: 'O campo Cidade é obrigatório' }),
  state: z.string().min(1, { message: 'O campo Estado é obrigatório' }),
  district: z.string().optional(),
  street: z.string().optional(),
  number: z.string().optional(),
  complement: z.string().optional(),
});

type AddressFormData = z.infer<typeof addressSchema>;

export const Address: React.FC = () => {
  const [submissionStatus, setSubmissionStatus] = useState<string | null>(null);
  const [validData, setValidData] = useState<AddressFormData | null>(null);

  const form = useForm<AddressFormData>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      postcode: '',
      city: '',
      state: '',
      district: '',
      street: '',
      number: '',
      complement: '',
    },
  });

  useEffect(() => {
    if (validData) {
      const submitData = async () => {
        try {
          setSubmissionStatus('Enviando...');
          const response = await fetch(getURI(ENTITIES.ADDRESSES), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(validData),
          });

          if (response.ok) {
            setSubmissionStatus('Endereço criado com sucesso!');
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

  const onSubmit = (data: AddressFormData) => {
    setValidData(data);
  };

  return (
    <div className="flex items-center justify-center w-full min-h-[calc(100vh-120px)] h-full p-4 overflow-y-auto">
      <div className="p-6 border rounded-lg shadow-lg bg-card text-card-foreground w-full max-w-2xl mx-auto my-auto">
        <h2 className="text-2xl font-bold mb-6 text-center">Criar Endereço</h2>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="postcode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>CEP</FormLabel>
                    <FormControl>
                      <Input placeholder="00000-000" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cidade</FormLabel>
                    <FormControl>
                      <Input placeholder="Sua cidade" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="state"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Estado</FormLabel>
                    <FormControl>
                      <Input placeholder="Seu estado" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="street"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Logradouro</FormLabel>
                    <FormControl>
                      <Input placeholder="Rua, Avenida, etc." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="number"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Número</FormLabel>
                    <FormControl>
                      <Input placeholder="123" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="district"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bairro</FormLabel>
                    <FormControl>
                      <Input placeholder="Nome do bairro" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="md:col-span-2">
                <FormField
                  control={form.control}
                  name="complement"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Complemento</FormLabel>
                      <FormControl>
                        <Input placeholder="Apto, Bloco, etc." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
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
                Enviar
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
