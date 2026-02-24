// Auto-generated types matching Supabase schema
// In production, use `npx supabase gen types typescript` to generate

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          display_name: string | null;
          avatar_url: string | null;
          bio: string | null;
          interests: string[];
          onboarding_completed: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          display_name?: string | null;
          avatar_url?: string | null;
          bio?: string | null;
          interests?: string[];
          onboarding_completed?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          display_name?: string | null;
          avatar_url?: string | null;
          bio?: string | null;
          interests?: string[];
          onboarding_completed?: boolean;
          updated_at?: string;
        };
      };
      saved_contents: {
        Row: {
          id: string;
          user_id: string;
          type: "url" | "memo" | "image";
          title: string | null;
          description: string | null;
          url: string | null;
          image_url: string | null;
          memo: string | null;
          category_id: string | null;
          metadata: Json;
          is_archived: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          type: "url" | "memo" | "image";
          title?: string | null;
          description?: string | null;
          url?: string | null;
          image_url?: string | null;
          memo?: string | null;
          category_id?: string | null;
          metadata?: Json;
          is_archived?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          type?: "url" | "memo" | "image";
          title?: string | null;
          description?: string | null;
          url?: string | null;
          image_url?: string | null;
          memo?: string | null;
          category_id?: string | null;
          metadata?: Json;
          is_archived?: boolean;
          updated_at?: string;
        };
      };
      content_tags: {
        Row: {
          content_id: string;
          tag: string;
        };
        Insert: {
          content_id: string;
          tag: string;
        };
        Update: {
          content_id?: string;
          tag?: string;
        };
      };
      categories: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          color: string;
          icon: string | null;
          sort_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          color?: string;
          icon?: string | null;
          sort_order?: number;
          created_at?: string;
        };
        Update: {
          name?: string;
          color?: string;
          icon?: string | null;
          sort_order?: number;
        };
      };
      recommendations: {
        Row: {
          id: string;
          user_id: string;
          type: "content" | "insight" | "action";
          title: string;
          description: string | null;
          source_url: string | null;
          reasoning: string | null;
          relevance_score: number | null;
          feedback: "liked" | "disliked" | null;
          is_read: boolean;
          metadata: Json;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          type: "content" | "insight" | "action";
          title: string;
          description?: string | null;
          source_url?: string | null;
          reasoning?: string | null;
          relevance_score?: number | null;
          feedback?: "liked" | "disliked" | null;
          is_read?: boolean;
          metadata?: Json;
          created_at?: string;
        };
        Update: {
          feedback?: "liked" | "disliked" | null;
          is_read?: boolean;
        };
      };
      automations: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          type: "news_collect" | "content_alert" | "schedule";
          config: Json;
          schedule: string | null;
          is_active: boolean;
          last_run_at: string | null;
          next_run_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          type: "news_collect" | "content_alert" | "schedule";
          config?: Json;
          schedule?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          name?: string;
          type?: "news_collect" | "content_alert" | "schedule";
          config?: Json;
          schedule?: string | null;
          is_active?: boolean;
          last_run_at?: string | null;
          next_run_at?: string | null;
          updated_at?: string;
        };
      };
      automation_logs: {
        Row: {
          id: string;
          automation_id: string;
          status: "success" | "error" | "partial";
          result: Json;
          items_count: number;
          executed_at: string;
        };
        Insert: {
          id?: string;
          automation_id: string;
          status: "success" | "error" | "partial";
          result?: Json;
          items_count?: number;
          executed_at?: string;
        };
        Update: never;
      };
      activity_logs: {
        Row: {
          id: string;
          user_id: string;
          action: string;
          entity_type: string | null;
          entity_id: string | null;
          metadata: Json;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          action: string;
          entity_type?: string | null;
          entity_id?: string | null;
          metadata?: Json;
          created_at?: string;
        };
        Update: never;
      };
      user_preferences: {
        Row: {
          user_id: string;
          dashboard_layout: Json;
          theme: "light" | "dark" | "system";
          language: "ko" | "en";
          notification_settings: Json;
          ai_settings: Json;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          dashboard_layout?: Json;
          theme?: "light" | "dark" | "system";
          language?: "ko" | "en";
          notification_settings?: Json;
          ai_settings?: Json;
          updated_at?: string;
        };
        Update: {
          dashboard_layout?: Json;
          theme?: "light" | "dark" | "system";
          language?: "ko" | "en";
          notification_settings?: Json;
          ai_settings?: Json;
          updated_at?: string;
        };
      };
      data_consents: {
        Row: {
          id: string;
          user_id: string;
          consent_type: string;
          is_granted: boolean;
          granted_at: string | null;
          revoked_at: string | null;
          ip_address: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          consent_type: string;
          is_granted: boolean;
          granted_at?: string | null;
          ip_address?: string | null;
          created_at?: string;
        };
        Update: {
          is_granted?: boolean;
          granted_at?: string | null;
          revoked_at?: string | null;
        };
      };
      wallet_connections: {
        Row: {
          id: string;
          user_id: string;
          wallet_address: string;
          chain_id: number;
          wallet_type: string | null;
          is_primary: boolean;
          connected_at: string;
          last_verified_at: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          wallet_address: string;
          chain_id: number;
          wallet_type?: string | null;
          is_primary?: boolean;
          connected_at?: string;
        };
        Update: {
          wallet_address?: string;
          chain_id?: number;
          wallet_type?: string | null;
          is_primary?: boolean;
          last_verified_at?: string | null;
        };
      };
    };
  };
}
