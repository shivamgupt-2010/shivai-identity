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
  identityStrength?: number;
  riskLevel?: string;
  neuralPatternStatus?: string;
  isLocked?: boolean;
  trustScore?: number;
  verificationLevel?: number;
  humanConfidence?: number;
}

export interface ActivityLog {
  id: string;
  action: string;
  description: string;
  created_at: string;
  metadata?: any;
}

export interface Device {
  id: string;
  device_name: string;
  device_type: string;
  last_active: string;
  is_trusted: boolean;
  browser?: string;
  os?: string;
  location_city?: string;
  location_country?: string;
}

export interface EcosystemNode {
  id: string;
  label: string;
  status: 'online' | 'offline' | 'warning';
  type: 'app' | 'core' | 'service';
  connections: string[];
}

export class ShivAIIdentity {
  private supabase: SupabaseClient;

  constructor(supabaseUrl: string, supabaseAnonKey: string) {
    this.supabase = createClient(supabaseUrl, supabaseAnonKey);
  }

  // AUTH
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

  // PROFILE & INTEL
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
      identityStrength: profile?.identity_strength,
      riskLevel: profile?.risk_level,
      neuralPatternStatus: profile?.neural_pattern_status,
      isLocked: profile?.is_locked,
      trustScore: profile?.trust_score,
      verificationLevel: profile?.verification_level,
      humanConfidence: profile?.human_confidence,
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

  async triggerIntelligenceRefresh() {
    const { data: { user } } = await this.supabase.auth.getUser();
    if (!user) return;
    await this.supabase.rpc('calculate_identity_strength', { p_user_id: user.id });
  }

  async lockdown() {
    const { data: { user } } = await this.supabase.auth.getUser();
    if (!user) return;
    await this.supabase.rpc('lockdown_ecosystem', { p_user_id: user.id });
    await this.logout();
  }

  // ECOSYSTEM
  async getTimeline(): Promise<ActivityLog[]> {
    const { data: { user } } = await this.supabase.auth.getUser();
    if (!user) return [];

    const { data } = await this.supabase
      .from('activity_logs')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(20);
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

  async getEcosystemGraph(): Promise<EcosystemNode[]> {
    const { data: { user } } = await this.supabase.auth.getUser();
    if (!user) return [];

    const { data: apps } = await this.supabase
      .from('connected_apps')
      .select('*')
      .eq('user_id', user.id);

    const nodes: EcosystemNode[] = [
      { id: 'core', label: 'AI Core', status: 'online', type: 'core', connections: ['identity'] },
      { id: 'identity', label: 'Identity Hub', status: 'online', type: 'app', connections: ['core'] },
    ];

    apps?.forEach(app => {
      nodes.push({
        id: app.id,
        label: app.app_name,
        status: app.status === 'Active' ? 'online' : 'offline',
        type: 'app',
        connections: ['identity']
      });
      nodes[1].connections.push(app.id);
    });

    return nodes;
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
    await this.triggerIntelligenceRefresh();
  }
}
