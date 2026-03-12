import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://zztpugxtkpsakbjbjzaf.supabase.co';
const supabaseAnonKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp6dHB1Z3h0a3BzYWtiamJqemFmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMzMTk2NzksImV4cCI6MjA4ODg5NTY3OX0.-GosE7pBV7NeVLjw62eCxuyO87QIOqD6wWEv9KgwrHI';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
