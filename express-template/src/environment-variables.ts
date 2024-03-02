import dotenv from 'dotenv';

dotenv.config();

const EnvironmentVariables = {
  SUPABASE_URL: process.env.SUPABASE_URL,
  SUPABASE_KEY: process.env.SUPABASE_KEY,
  SUPABASE_JWT_SECRET: process.env.SUPABASE_JWT_SECRET,
};

export default EnvironmentVariables;