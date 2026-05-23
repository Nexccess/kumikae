import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY,
);

export type KpiLog = {
  user_id: string;
  micro_score: number;
  macro_score: number;
  gap_type: string;
  strategy: string;
  total_cost: number;
  selected_parts: string;
  diagnosis_feature: string;
  diagnosis_judgment: string;
};

export async function logToSheets(data: KpiLog): Promise<void> {
  const { error } = await supabase.from('kpi_logs').insert([data]);
  if (error) console.error('Supabase insert error:', error.message);
}