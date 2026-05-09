import { createClient, SupabaseClient, User } from '@supabase/supabase-js';

export interface ShivAIUser extends User {
  behaviorScore?: number;
  permissions?: string[];
  username?: string;
  fullName?: string;
  bio?: string;
  theme?: string;
  isVerified?: boolean;
  dob?: string;
  country?: string;
}

export interface ActivityLog {
  id: string;
  action: string;
  description: string;
  created_at: string;
}

export interface Device {
  id: string;
  device_name: string;
  device_type: string;
  last_active: string;
  is_trusted: boolean;
}

export class ShivAIIdentity {
  private supabase: SupabaseClient;

  constructor(supabaseUrl: string, supabaseAnonKey: string) {
    this.supabase = createClient(supabaseUrl, supabaseAnonKey);
  }

  // AUTH (Password-based for @shiv.ai handles)
  async signUp(email: string, password: string, metadata: any = {}) {
    return await this.supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata,
      },
    });
  }

  async login(email: string, password: string) {
    return await this.supabase.auth.signInWithPassword({
      email,
      password,
    });
  }

  async logout() {
    return await this.supabase.auth.signOut();
  }

  // PROFILE
  async getCurrentUser(): Promise<ShivAIUser | null> {
    const { data: { user } } = await this.supabase.auth.getUser();
    if (!user) return null;

    const { data: profile } = await this.supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    return {
      ...user,
      behaviorScore: profile?.behavior_score,
      permissions: profile?.permissions,
      username: profile?.username,
      fullName: profile?.full_name,
      bio: profile?.bio,
      theme: profile?.theme,
      isVerified: profile?.is_verified,
      dob: profile?.dob,
      country: profile?.country,
    };
  }

  async updateProfile(updates: any) {
    const { data: { user } } = await this.supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    return await this.supabase
      .from('profiles')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', user.id);
  }

  // ECOSYSTEM INTEL
  async getTimeline(): Promise<ActivityLog[]> {
    const { data: { user } } = await this.supabase.auth.getUser();
    if (!user) return [];

    const { data } = await this.supabase
      .from('activity_logs')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(10);
    return data || [];
  }

  async getDevices(): Promise<Device[]> {
    const { data: { user } } = await this.supabase.auth.getUser();
    if (!user) return [];

    const { data } = await this.supabase
      .from('devices')
      .select('*')
      .eq('user_id', user.id)
      .order('last_active', { ascending: false });
    return data || [];
  }

  async registerDevice(name: string, type: string) {
     const { data: { user } } = await this.supabase.auth.getUser();
     if (!user) return;
     
     await this.supabase.from('devices').insert({
       user_id: user.id,
       device_name: name,
       device_type: type
     });
  }

  async trackAction(action: string, description: string, metadata: any = {}) {
    const { data: { user } } = await this.supabase.auth.getUser();
    if (!user) return;

    await this.supabase.from('activity_logs').insert({
      user_id: user.id,
      action,
      description,
      metadata
    });
    
    // Silent background logic to improve score
    await this.supabase.rpc('increment_behavior_score', { user_id: user.id, amount: 0.05 });
  }
}
