import {createClient} from '@supabase/supabase-js';
import EnvironmentVariables from '../environment-variables';

const supabaseUrl = EnvironmentVariables.SUPABASE_URL;
const supabaseKey = EnvironmentVariables.SUPABASE_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
    detectSessionInUrl: false,
  },
});