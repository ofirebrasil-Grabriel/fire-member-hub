export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      calendar_items: {
        Row: {
          created_at: string | null
          due_date: string | null
          id: string
          is_critical: boolean | null
          is_fixed: boolean | null
          paid: boolean | null
          source_debt_id: string | null
          title: string
          user_id: string
          value: number | null
        }
        Insert: {
          created_at?: string | null
          due_date?: string | null
          id?: string
          is_critical?: boolean | null
          is_fixed?: boolean | null
          paid?: boolean | null
          source_debt_id?: string | null
          title: string
          user_id: string
          value?: number | null
        }
        Update: {
          created_at?: string | null
          due_date?: string | null
          id?: string
          is_critical?: boolean | null
          is_fixed?: boolean | null
          paid?: boolean | null
          source_debt_id?: string | null
          title?: string
          user_id?: string
          value?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "calendar_items_source_debt_id_fkey"
            columns: ["source_debt_id"]
            isOneToOne: false
            referencedRelation: "debts"
            referencedColumns: ["id"]
          },
        ]
      }
      card_policy: {
        Row: {
          blocked_categories: string[] | null
          created_at: string | null
          id: string
          installment_rule: string | null
          updated_at: string | null
          user_id: string
          weekly_limit: number | null
        }
        Insert: {
          blocked_categories?: string[] | null
          created_at?: string | null
          id?: string
          installment_rule?: string | null
          updated_at?: string | null
          user_id: string
          weekly_limit?: number | null
        }
        Update: {
          blocked_categories?: string[] | null
          created_at?: string | null
          id?: string
          installment_rule?: string | null
          updated_at?: string | null
          user_id?: string
          weekly_limit?: number | null
        }
        Relationships: []
      }
      cuts: {
        Row: {
          category: string | null
          created_at: string | null
          estimated_value: number | null
          id: string
          item: string
          status: string | null
          user_id: string
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          estimated_value?: number | null
          id?: string
          item: string
          status?: string | null
          user_id: string
        }
        Update: {
          category?: string | null
          created_at?: string | null
          estimated_value?: number | null
          id?: string
          item?: string
          status?: string | null
          user_id?: string
        }
        Relationships: []
      }
      day_progress: {
        Row: {
          completed: boolean | null
          completed_at: string | null
          completed_tasks: string[] | null
          created_at: string | null
          day_id: number
          diary_entry: string | null
          id: string
          mood: string | null
          payload: Json | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          completed?: boolean | null
          completed_at?: string | null
          completed_tasks?: string[] | null
          created_at?: string | null
          day_id: number
          diary_entry?: string | null
          id?: string
          mood?: string | null
          payload?: Json | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          completed?: boolean | null
          completed_at?: string | null
          completed_tasks?: string[] | null
          created_at?: string | null
          day_id?: number
          diary_entry?: string | null
          id?: string
          mood?: string | null
          payload?: Json | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "day_progress_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      days: {
        Row: {
          challenge_details: string | null
          commitment: string | null
          concept: string | null
          concept_audio_url: string | null
          concept_title: string | null
          created_at: string | null
          description: string | null
          emoji: string | null
          expected_result: string | null
          id: number
          morning_audio_url: string | null
          morning_message: string | null
          next_day_preview: string | null
          reflection_prompt: string | null
          reflection_questions: string[] | null
          subtitle: string
          task_steps: Json | null
          task_title: string | null
          title: string
          tools: string[] | null
          updated_at: string | null
        }
        Insert: {
          challenge_details?: string | null
          commitment?: string | null
          concept?: string | null
          concept_audio_url?: string | null
          concept_title?: string | null
          created_at?: string | null
          description?: string | null
          emoji?: string | null
          expected_result?: string | null
          id?: number
          morning_audio_url?: string | null
          morning_message?: string | null
          next_day_preview?: string | null
          reflection_prompt?: string | null
          reflection_questions?: string[] | null
          subtitle: string
          task_steps?: Json | null
          task_title?: string | null
          title: string
          tools?: string[] | null
          updated_at?: string | null
        }
        Update: {
          challenge_details?: string | null
          commitment?: string | null
          concept?: string | null
          concept_audio_url?: string | null
          concept_title?: string | null
          created_at?: string | null
          description?: string | null
          emoji?: string | null
          expected_result?: string | null
          id?: number
          morning_audio_url?: string | null
          morning_message?: string | null
          next_day_preview?: string | null
          reflection_prompt?: string | null
          reflection_questions?: string[] | null
          subtitle?: string
          task_steps?: Json | null
          task_title?: string | null
          title?: string
          tools?: string[] | null
          updated_at?: string | null
        }
        Relationships: []
      }
      debts: {
        Row: {
          created_at: string | null
          creditor: string
          due_day: number | null
          id: string
          installment_value: number | null
          is_critical: boolean | null
          notes: string | null
          status: string | null
          total_balance: number | null
          type: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          creditor: string
          due_day?: number | null
          id?: string
          installment_value?: number | null
          is_critical?: boolean | null
          notes?: string | null
          status?: string | null
          total_balance?: number | null
          type?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          creditor?: string
          due_day?: number | null
          id?: string
          installment_value?: number | null
          is_critical?: boolean | null
          notes?: string | null
          status?: string | null
          total_balance?: number | null
          type?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      monthly_budget: {
        Row: {
          created_at: string | null
          essentials: Json | null
          gap: number | null
          id: string
          income: number | null
          leisure: number | null
          minimum_debts: number | null
          month_year: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          essentials?: Json | null
          gap?: number | null
          id?: string
          income?: number | null
          leisure?: number | null
          minimum_debts?: number | null
          month_year: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          essentials?: Json | null
          gap?: number | null
          id?: string
          income?: number | null
          leisure?: number | null
          minimum_debts?: number | null
          month_year?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      negotiations: {
        Row: {
          channel: string | null
          created_at: string | null
          creditor: string
          debt_id: string | null
          id: string
          max_entry: number | null
          max_installment: number | null
          notes: string | null
          response: string | null
          script_used: boolean | null
          status: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          channel?: string | null
          created_at?: string | null
          creditor: string
          debt_id?: string | null
          id?: string
          max_entry?: number | null
          max_installment?: number | null
          notes?: string | null
          response?: string | null
          script_used?: boolean | null
          status?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          channel?: string | null
          created_at?: string | null
          creditor?: string
          debt_id?: string | null
          id?: string
          max_entry?: number | null
          max_installment?: number | null
          notes?: string | null
          response?: string | null
          script_used?: boolean | null
          status?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "negotiations_debt_id_fkey"
            columns: ["debt_id"]
            isOneToOne: false
            referencedRelation: "debts"
            referencedColumns: ["id"]
          },
        ]
      }
      plan_306090: {
        Row: {
          created_at: string | null
          goals_30: string[] | null
          goals_60: string[] | null
          goals_90: string[] | null
          id: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          goals_30?: string[] | null
          goals_60?: string[] | null
          goals_90?: string[] | null
          id?: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          goals_30?: string[] | null
          goals_60?: string[] | null
          goals_90?: string[] | null
          id?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          email: string
          full_name: string
          id: string
          role: string | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          email: string
          full_name?: string
          id: string
          role?: string | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string
          full_name?: string
          id?: string
          role?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      settings: {
        Row: {
          description: string | null
          id: string
          key: string
          updated_at: string | null
          updated_by: string | null
          value: Json
        }
        Insert: {
          description?: string | null
          id?: string
          key: string
          updated_at?: string | null
          updated_by?: string | null
          value?: Json
        }
        Update: {
          description?: string | null
          id?: string
          key?: string
          updated_at?: string | null
          updated_by?: string | null
          value?: Json
        }
        Relationships: []
      }
      subscriptions: {
        Row: {
          created_at: string | null
          expires_at: string | null
          hotmart_sale_id: string | null
          id: string
          product_id: string
          started_at: string | null
          status: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          expires_at?: string | null
          hotmart_sale_id?: string | null
          id?: string
          product_id: string
          started_at?: string | null
          status?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          expires_at?: string | null
          hotmart_sale_id?: string | null
          id?: string
          product_id?: string
          started_at?: string | null
          status?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_profile: {
        Row: {
          anxiety_score: number | null
          clarity_score: number | null
          created_at: string | null
          fixed_time: string | null
          id: string
          no_new_debt_commitment: boolean | null
          onboarding_completed: boolean | null
          sources: string[] | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          anxiety_score?: number | null
          clarity_score?: number | null
          created_at?: string | null
          fixed_time?: string | null
          id?: string
          no_new_debt_commitment?: boolean | null
          onboarding_completed?: boolean | null
          sources?: string[] | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          anxiety_score?: number | null
          clarity_score?: number | null
          created_at?: string | null
          fixed_time?: string | null
          id?: string
          no_new_debt_commitment?: boolean | null
          onboarding_completed?: boolean | null
          sources?: string[] | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      webhook_logs: {
        Row: {
          event: string
          id: string
          payload: Json
          received_at: string | null
          response: Json | null
          source: string
          status_code: number | null
        }
        Insert: {
          event: string
          id?: string
          payload: Json
          received_at?: string | null
          response?: Json | null
          source: string
          status_code?: number | null
        }
        Update: {
          event?: string
          id?: string
          payload?: Json
          received_at?: string | null
          response?: Json | null
          source?: string
          status_code?: number | null
        }
        Relationships: []
      }
      weekly_ritual: {
        Row: {
          checklist: Json | null
          created_at: string | null
          day_of_week: number | null
          id: string
          user_id: string
        }
        Insert: {
          checklist?: Json | null
          created_at?: string | null
          day_of_week?: number | null
          id?: string
          user_id: string
        }
        Update: {
          checklist?: Json | null
          created_at?: string | null
          day_of_week?: number | null
          id?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "moderator", "user"],
    },
  },
} as const
