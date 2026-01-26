import { useState, useEffect, useCallback } from 'react';
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
import { Textarea } from '@/components/ui/textarea';
import { getURI, ENTITIES } from '@/services/getURI';
import { Pencil, Trash2 } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const ruleSchema = z.object({
  name: z.string().min(1, { message: 'O campo Nome é obrigatório' }),
  description: z.string().optional(),
  is_active: z.boolean(),
});

type RuleFormData = z.infer<typeof ruleSchema>;

interface Rule extends RuleFormData {
  id: number;
  created_at?: string;
  updated_at?: string;
}

export const Rules = () => {
  const [submissionStatus, setSubmissionStatus] = useState<string | null>(null);
  const [rules, setRules] = useState<Rule[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);

  const form = useForm<RuleFormData>({
    resolver: zodResolver(ruleSchema),
    defaultValues: {
      name: '',
      description: '',
      is_active: true,
    },
  });

  const fetchRules = useCallback(async () => {
    try {
      const response = await fetch(getURI(ENTITIES.RULES));
      if (response.ok) {
        const data = await response.json();
        setRules(data);
      } else {
        console.error('Failed to fetch rules');
      }
    } catch (e) {
      console.error('Error fetching rules:', e);
    }
  }, []);

  useEffect(() => {
    fetchRules();
  }, [fetchRules]);

  const onSubmit = async (data: RuleFormData) => {
    try {
      setSubmissionStatus('Enviando...');
      const url = editingId ? `${getURI(ENTITIES.RULES)}/${editingId}` : getURI(ENTITIES.RULES);
      const method = editingId ? 'PATCH' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setSubmissionStatus(`Regra ${editingId ? 'atualizada' : 'criada'} com sucesso!`);
        form.reset({ name: '', description: '', is_active: true });
        setEditingId(null);
        fetchRules();
        setTimeout(() => setSubmissionStatus(null), 3000);
      } else {
        const errorData = await response.json().catch(() => ({}));
        setSubmissionStatus(`Erro: ${errorData.message || response.statusText}`);
      }
    } catch (e) {
      console.error('Fetch error:', e);
      setSubmissionStatus(`Erro ao enviar formulário: ${e instanceof Error ? e.message : 'Erro de rede ou CORS'}`);
    }
  };

  const handleEdit = (rule: Rule) => {
    setEditingId(rule.id);
    form.reset({
      name: rule.name,
      description: rule.description,
      is_active: rule.is_active,
    });
    setSubmissionStatus(null);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Tem certeza que deseja excluir esta regra?')) return;

    try {
      const response = await fetch(`${getURI(ENTITIES.RULES)}/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setSubmissionStatus('Regra excluída com sucesso!');
        fetchRules();
        if (editingId === id) {
          handleCancel();
        }
        setTimeout(() => setSubmissionStatus(null), 3000);
      } else {
        setSubmissionStatus('Erro ao excluir regra');
      }
    } catch (e) {
      console.error('Delete error:', e);
      setSubmissionStatus('Erro ao excluir regra');
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    form.reset({ name: '', description: '', is_active: true });
    setSubmissionStatus(null);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 w-full h-full p-4 overflow-hidden">
      {/* Form Section */}
      <div className="w-full lg:w-1/3 p-6 border rounded-lg shadow-lg bg-card text-card-foreground h-fit overflow-y-auto">
        <h2 className="text-2xl font-bold mb-6 text-center">
          {editingId ? 'Editar Regra' : 'Criar Regra'}
        </h2>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              <FormField
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome da Regra</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: admin, manager" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descrição</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Propósito desta regra"
                        className="resize-none"
                        {...field}
                      />
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
                      <FormLabel>Regra Ativa</FormLabel>
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
                onClick={handleCancel}
              >
                {editingId ? 'Cancelar' : 'Limpar'}
              </Button>
              <Button type="submit" className="flex-1">
                {editingId ? 'Atualizar' : 'Salvar'}
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

      {/* List Section */}
      <div className="flex-1 border rounded-lg shadow-lg bg-card text-card-foreground overflow-hidden flex flex-col">
        <div className="p-4 border-b">
          <h2 className="text-xl font-bold">Regras Cadastradas</h2>
        </div>
        <div className="overflow-auto flex-1 p-2">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead className="w-[100px] text-center">Ativa</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rules.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center h-24">
                    Nenhuma regra cadastrada.
                  </TableCell>
                </TableRow>
              ) : (
                rules.map((rule) => (
                  <TableRow key={rule.id}>
                    <TableCell className="font-medium">{rule.name}</TableCell>
                    <TableCell className="max-w-[200px] truncate" title={rule.description || ''}>
                      {rule.description || '-'}
                    </TableCell>
                    <TableCell className="text-center">
                      <Checkbox checked={rule.is_active} disabled />
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(rule)}
                          title="Editar"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive hover:text-destructive hover:bg-destructive/10"
                          onClick={() => handleDelete(rule.id)}
                          title="Excluir"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};
