import { supabase } from './supabase';

export const uploadFile = async (file: File, fileName: string) => {
  const { error } = await supabase.storage
    .from('patient-statements')
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: false
    });

  if (error) throw error;
};