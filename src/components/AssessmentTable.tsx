
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Skeleton } from '@/components/ui/skeleton';

// Define the structure for our assessment_results table
interface AssessmentResult {
  id: string;
  user_id: string;
  assessment_type: string;
  primary_result?: string | null;
  result_data: Record<string, any>;
  completed_at?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
}

const createAssessmentResultsTable = async () => {
  // Check if the assessment_results table exists
  const { data, error } = await supabase
    .from('assessment_results')
    .select('count(*)')
    .limit(1)
    .single();
  
  // If there's an error, the table might not exist
  if (error && error.code === 'PGRST116') {
    // Create the assessment_results table
    const createQuery = `
      CREATE TABLE IF NOT EXISTS public.assessment_results (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        user_id UUID REFERENCES auth.users NOT NULL,
        assessment_type TEXT NOT NULL,
        primary_result TEXT,
        result_data JSONB NOT NULL,
        completed_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
        UNIQUE(user_id, assessment_type)
      );
      
      ALTER TABLE public.assessment_results ENABLE ROW LEVEL SECURITY;
      
      CREATE POLICY "Users can view their own assessment results"
      ON public.assessment_results
      FOR SELECT
      USING (auth.uid() = user_id);
      
      CREATE POLICY "Users can insert their own assessment results"
      ON public.assessment_results
      FOR INSERT
      WITH CHECK (auth.uid() = user_id);
      
      CREATE POLICY "Users can update their own assessment results"
      ON public.assessment_results
      FOR UPDATE
      USING (auth.uid() = user_id);
    `;
    
    // Run the query to create the table
    const { error: createError } = await supabase.rpc('exec', { query: createQuery });
    
    if (createError) {
      console.error('Error creating assessment_results table:', createError);
    }
  }
};

export const ensureAssessmentResultsTable = async () => {
  try {
    await createAssessmentResultsTable();
  } catch (error) {
    console.error('Error ensuring assessment_results table:', error);
  }
};

export default ensureAssessmentResultsTable;
