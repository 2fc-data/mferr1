import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { getURI, ENTITIES } from '@/services/getURI';

interface CauseFormData {
  number: string;
  court_id: number;
  court_division_id: number;
  area_id: number;
  stage_id: number;
  status_id: number;
  outcome_id?: number;
  subject: string;
  description?: string;
  value?: number;
}

export const CauseForm: React.FC = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<CauseFormData>();
  const [submissionStatus, setSubmissionStatus] = useState<string | null>(null);

  const onSubmit = async (data: CauseFormData) => {
    try {
      const response = await fetch(getURI(ENTITIES.CAUSES), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (response.ok) setSubmissionStatus('Cause created!');
      else setSubmissionStatus(`Error: ${response.statusText}`);
    } catch (e) { setSubmissionStatus('Error submitting form'); }
  };

  return (
    <div className="p-4 border rounded shadow-md">
      <h2 className="text-xl font-bold mb-4">Create Cause</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <Label htmlFor="number">Number</Label>
          <Input id="number" {...register('number', { required: true })} />
          {errors.number && <span className="text-red-500">Required</span>}
        </div>
        <div>
          <Label htmlFor="subject">Subject</Label>
          <Input id="subject" {...register('subject', { required: true })} />
          {errors.subject && <span className="text-red-500">Required</span>}
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="court_id">Court ID</Label>
            <Input type="number" id="court_id" {...register('court_id', { required: true, valueAsNumber: true })} />
          </div>
          <div>
            <Label htmlFor="court_division_id">Division ID</Label>
            <Input type="number" id="court_division_id" {...register('court_division_id', { required: true, valueAsNumber: true })} />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="area_id">Area ID</Label>
            <Input type="number" id="area_id" {...register('area_id', { required: true, valueAsNumber: true })} />
          </div>
          <div>
            <Label htmlFor="stage_id">Stage ID</Label>
            <Input type="number" id="stage_id" {...register('stage_id', { required: true, valueAsNumber: true })} />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="status_id">Status ID</Label>
            <Input type="number" id="status_id" {...register('status_id', { required: true, valueAsNumber: true })} />
          </div>
          <div>
            <Label htmlFor="outcome_id">Outcome ID</Label>
            <Input type="number" id="outcome_id" {...register('outcome_id', { valueAsNumber: true })} />
          </div>
        </div>
        <div>
          <Label htmlFor="value">Value</Label>
          <Input type="number" id="value" {...register('value', { valueAsNumber: true })} />
        </div>
        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea id="description" {...register('description')} />
        </div>
        <Button type="submit">Submit</Button>
      </form>
      {submissionStatus && <p className="mt-4">{submissionStatus}</p>}
    </div>
  );
};
