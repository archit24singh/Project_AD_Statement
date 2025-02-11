import { supabase } from './supabase';
import type { Statement, StatementUpload, SearchParams } from './types';

const parseFilename = (filename: string): { lastname: string; dob: number; phoneNumber: string } | null => {
  const match = filename.match(/^([a-zA-Z]+)_(\d{4})_(\d{10})\.pdf$/);
  if (!match) return null;
  
  const [, lastname, yearStr, phoneNumber] = match;
  const year = parseInt(yearStr, 10);
  
  if (year < 1900 || year > new Date().getFullYear()) return null;
  
  return {
    lastname: lastname.charAt(0).toUpperCase() + lastname.slice(1).toLowerCase(),
    dob: year,
    phoneNumber
  };
};

export const uploadStatement = async (data: StatementUpload): Promise<Statement> => {
  // Check if user is authenticated
  const { data: session } = await supabase.auth.getSession();
  if (!session?.session?.user) {
    throw new Error('Authentication required');
  }

  const fileInfo = parseFilename(data.name);
  if (!fileInfo) {
    throw new Error('Invalid filename format. Expected: lastname_birthyear_phonenumber.pdf');
  }

  // Upload file to storage bucket
  const { data: uploadData, error: uploadError } = await supabase.storage
    .from('patient-statements')
    .upload(data.name, new Blob([data.content]), {
      contentType: 'application/pdf',
      upsert: true
    });

  if (uploadError) {
    console.error('Storage upload error:', uploadError);
    throw uploadError;
  }

  // Get a public URL for the file
  const { data: { publicUrl } } = supabase.storage
    .from('patient-statements')
    .getPublicUrl(data.name);

  // Store metadata in database
  const { data: statement, error: dbError } = await supabase
    .from('statements')
    .insert({
      name: data.name,
      size: data.size,
      lastname: fileInfo.lastname,
      dob: fileInfo.dob,
      phone_number: fileInfo.phoneNumber,
      file_path: uploadData.path,
      file_url: publicUrl
    })
    .select()
    .single();

  if (dbError) {
    console.error('Database error:', dbError);
    throw dbError;
  }

  return statement;
};

export const searchStatements = async ({ lastname, dob, phone_number }: SearchParams): Promise<Statement[]> => {
  const year = Number(dob);
  
  try {
    const { data, error } = await supabase
      .from('statements')
      .select('*')
      .ilike('lastname', `${lastname}%`)
      .eq('dob', year)
      .eq('phone_number', phone_number); // Always include phone number in query

    if (error) {
      console.error('Supabase error:', error);
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error('Search failed:', error);
    throw error;
  }
};
