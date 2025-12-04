import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://hxsjaegmfvpunlbxmonm.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh4c2phZWdtZnZwdW5sYnhtb25tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI0NTYyNTUsImV4cCI6MjA3ODAzMjI1NX0.AoIOgsCpJ9lGDQo4MEKTYJj3RRSuN12q2y4YtE2-_RQ';

const customSupabaseClient = createClient(supabaseUrl, supabaseAnonKey);

export default customSupabaseClient;

export { 
    customSupabaseClient,
    customSupabaseClient as supabase,
};
