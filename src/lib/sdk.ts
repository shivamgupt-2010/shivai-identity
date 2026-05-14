import { createClient, SupabaseClient, User, Session } from '@supabase/supabase-js';

/**
 * PRODUCTION-GRADE SHIVAI IDENTITY SDK
 * Version: 2.1.0-STABLE
 */

export interface ShivAIProfile {
  id: string;
  username: string;
  full_name: string;
  avatar_url?: string;
  dob?: string;
  country?: string;
  identity_strength: number;
  trust_score: number;
  behavior_score: number;
  status: 'active' | 'suspended' | 'lockdown';
  is_verified: boolean;
  metadata: Record<string, any>;
  neural_pattern_status?: string;
  is_locked?: boolean;
  verification_level?: number;
  human_confidence?: number;
}

export interface ShivAIUser extends User, ShivAIProfile {}

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

export class ShivAISDK {
  private static instance: ShivAISDK;
  public supabase: SupabaseClient;

  private constructor(url: string, key: string) {
    this.supabase = createClient(url, key);
  }

  public static getInstance(url: string, key: string): ShivAISDK {
    if (!ShivAISDK.instance) {
      ShivAISDK.instance = new ShivAISDK(url, key);
    }
    return ShivAISDK.instance;
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
    await this.supabase.auth.signOut();
  }

  // PROFILE & INTEL
  async getCurrentUser(): Promise<User | null> {
    const { data: { user } } = await this.supabase.auth.getUser();
    return user;
  }

  async getProfile(userId: string): Promise<ShivAIProfile | null> {
    const { data, error } = await this.supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (error) return null;
    return data as ShivAIProfile;
  }

  async updateProfile(updates: any) {
    const user = await this.getCurrentUser();
    if (!user) throw new Error('Not authenticated');

    return await this.supabase
      .from('profiles')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', user.id);
  }

  async triggerIntelligenceRefresh() {
    const user = await this.getCurrentUser();
    if (!user) return;
    await this.supabase.rpc('calculate_identity_strength', { p_user_id: user.id });
  }

  async lockdown() {
    const user = await this.getCurrentUser();
    if (!user) return;
    await this.supabase.rpc('lockdown_ecosystem', { p_user_id: user.id });
    await this.logout();
  }

  // ECOSYSTEM
  async getTimeline(): Promise<ActivityLog[]> {
    const user = await this.getCurrentUser();
    if (!user) return [];

    const { data } = await this.supabase
      .from('ecosystem_logs')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(20);
    return data || [];
  }

  async getDevices(): Promise<Device[]> {
    const user = await this.getCurrentUser();
    if (!user) return [];

    const { data } = await this.supabase
      .from('devices')
      .select('*')
      .eq('user_id', user.id)
      .order('last_active', { ascending: false });
    return data || [];
  }

  async getEcosystemGraph(): Promise<EcosystemNode[]> {
    const user = await this.getCurrentUser();
    if (!user) return [];

    const { data: apps } = await this.supabase
      .from('connected_apps')
      .select('*')
      .eq('user_id', user.id);

    const nodes: EcosystemNode[] = [
      { id: 'core', label: 'AI Core', status: 'online', type: 'core', connections: ['identity'] },
      { id: 'identity', label: 'Identity Hub', status: 'online', type: 'app', connections: ['core'] },
      { id: 'drive', label: 'ShivAI Drive', status: 'online', type: 'app', connections: ['identity'] },
      { id: 'mail', label: 'ShivAI Mail', status: 'offline', type: 'app', connections: ['identity'] },
      { id: 'connect', label: 'VibeConnect', status: 'offline', type: 'app', connections: ['identity'] },
    ];

    nodes[1].connections.push('drive', 'mail', 'connect');

    apps?.forEach(app => {
      if (!nodes.find(n => n.label === app.app_name)) {
        nodes.push({
          id: app.id,
          label: app.app_name,
          status: app.status === 'Active' ? 'online' : 'offline',
          type: 'app',
          connections: ['identity']
        });
        nodes[1].connections.push(app.id);
      }
    });

    return nodes;
  }

  async trackAction(appId: string, action: string, description: string, metadata: any = {}) {
    const user = await this.getCurrentUser();
    if (!user) return;

    await this.supabase.from('ecosystem_logs').insert({
      user_id: user.id,
      app_id: appId,
      action,
      metadata: { ...metadata, description }
    });
    
    // Silent background logic to improve score
    await this.supabase.rpc('increment_behavior_score', { user_id: user.id, amount: 0.1 });
    await this.triggerIntelligenceRefresh();
  }

  onAuthStateChange(callback: (session: Session | null) => void) {
    return this.supabase.auth.onAuthStateChange((_event, session) => {
      callback(session);
    });
  }

  // PRESENCE
  trackPresence(channelName: string, userData: any) {
    const channel = this.supabase.channel(channelName, {
      config: {
        presence: {
          key: userData.id,
        },
      },
    });

    return channel;
  }
}

// Global Export for Ecosystem Sync
export const shivai = ShivAISDK.getInstance(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
export const identity = shivai;
