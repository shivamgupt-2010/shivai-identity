import { ShivAIIdentity } from './sdk';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const identity = new ShivAIIdentity(supabaseUrl, supabaseAnonKey);
