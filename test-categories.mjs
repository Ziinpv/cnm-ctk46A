import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://crsippgfbzxeguugnfms.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNyc2lwcGdmYnp4ZWd1dWduZm1zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgzMjMyMzQsImV4cCI6MjA5Mzg5OTIzNH0.LSF8ZRugJ39kYuH3DXU50MRj_ANJXoLiVDgZ38AREjs';

const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
  console.log('Fetching categories...');
  const { data, error } = await supabase.from('categories').select('*');
  console.log('Data:', data);
  console.log('Error:', error);
}

test();
