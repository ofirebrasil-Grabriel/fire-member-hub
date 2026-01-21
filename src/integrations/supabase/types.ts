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
      achievements: {
        Row: {
          card_theme: string | null
          claimed_at: string | null
          created_at: string | null
          day_id: number
          id: string
          motivation_phrase: string | null
          reward_label: string | null
          title: string
          user_id: string
          xp_earned: number | null
        }
        Insert: {
          card_theme?: string | null
          claimed_at?: string | null
          created_at?: string | null
          day_id: number
          id?: string
          motivation_phrase?: string | null
          reward_label?: string | null
          title: string
          user_id: string
          xp_earned?: number | null
        }
        Update: {
          card_theme?: string | null
          claimed_at?: string | null
          created_at?: string | null
          day_id?: number
          id?: string
          motivation_phrase?: string | null
          reward_label?: string | null
          title?: string
          user_id?: string
          xp_earned?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "achievements_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      agreements: {
        Row: {
          boleto_path: string | null
          contract_path: string | null
          created_at: string | null
          creditor_name: string
          debt_id: string | null
          end_date: string | null
          entry_amount: number | null
          id: string
          installments: number
          interest_rate: number | null
          monthly_payment: number
          negotiation_plan_id: string | null
          next_payment_date: string | null
          original_value: number | null
          paid_installments: number | null
          savings: number | null
          start_date: string
          status: string | null
          total_amount: number
          updated_at: string | null
          user_id: string
        }
        Insert: {
          boleto_path?: string | null
          contract_path?: string | null
          created_at?: string | null
          creditor_name: string
          debt_id?: string | null
          end_date?: string | null
          entry_amount?: number | null
          id?: string
          installments: number
          interest_rate?: number | null
          monthly_payment: number
          negotiation_plan_id?: string | null
          next_payment_date?: string | null
          original_value?: number | null
          paid_installments?: number | null
          savings?: number | null
          start_date: string
          status?: string | null
          total_amount: number
          updated_at?: string | null
          user_id: string
        }
        Update: {
          boleto_path?: string | null
          contract_path?: string | null
          created_at?: string | null
          creditor_name?: string
          debt_id?: string | null
          end_date?: string | null
          entry_amount?: number | null
          id?: string
          installments?: number
          interest_rate?: number | null
          monthly_payment?: number
          negotiation_plan_id?: string | null
          next_payment_date?: string | null
          original_value?: number | null
          paid_installments?: number | null
          savings?: number | null
          start_date?: string
          status?: string | null
          total_amount?: number
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "agreements_debt_id_fkey"
            columns: ["debt_id"]
            isOneToOne: false
            referencedRelation: "debts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "agreements_negotiation_plan_id_fkey"
            columns: ["negotiation_plan_id"]
            isOneToOne: false
            referencedRelation: "negotiation_plans"
            referencedColumns: ["id"]
          },
        ]
      }
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
      daily_log: {
        Row: {
          breathe_reason: string
          breathe_score: number
          completed_at: string | null
          created_at: string | null
          day_number: number
          id: string
          status: string | null
          user_id: string
        }
        Insert: {
          breathe_reason: string
          breathe_score: number
          completed_at?: string | null
          created_at?: string | null
          day_number: number
          id?: string
          status?: string | null
          user_id: string
        }
        Update: {
          breathe_reason?: string
          breathe_score?: number
          completed_at?: string | null
          created_at?: string | null
          day_number?: number
          id?: string
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
          form_data: Json | null
          id: string
          mood: string | null
          reward_claimed: boolean | null
          reward_timestamp: string | null
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
          form_data?: Json | null
          id?: string
          mood?: string | null
          reward_claimed?: boolean | null
          reward_timestamp?: string | null
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
          form_data?: Json | null
          id?: string
          mood?: string | null
          reward_claimed?: boolean | null
          reward_timestamp?: string | null
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
          icon_name: string | null
          id: number
          morning_audio_url: string | null
          morning_message: string | null
          motivation_phrase: string | null
          next_day_preview: string | null
          reflection_prompt: string | null
          reflection_questions: string[] | null
          reward_icon: string | null
          reward_label: string | null
          reward_message: string | null
          subtitle: string
          task_steps: Json | null
          task_title: string | null
          title: string
          tools: string[] | null
          updated_at: string | null
          xp_reward: number | null
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
          icon_name?: string | null
          id?: number
          morning_audio_url?: string | null
          morning_message?: string | null
          motivation_phrase?: string | null
          next_day_preview?: string | null
          reflection_prompt?: string | null
          reflection_questions?: string[] | null
          reward_icon?: string | null
          reward_label?: string | null
          reward_message?: string | null
          subtitle: string
          task_steps?: Json | null
          task_title?: string | null
          title: string
          tools?: string[] | null
          updated_at?: string | null
          xp_reward?: number | null
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
          icon_name?: string | null
          id?: number
          morning_audio_url?: string | null
          morning_message?: string | null
          motivation_phrase?: string | null
          next_day_preview?: string | null
          reflection_prompt?: string | null
          reflection_questions?: string[] | null
          reward_icon?: string | null
          reward_label?: string | null
          reward_message?: string | null
          subtitle?: string
          task_steps?: Json | null
          task_title?: string | null
          title?: string
          tools?: string[] | null
          updated_at?: string | null
          xp_reward?: number | null
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
          installments_remaining: number | null
          interest_rate: number | null
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
          installments_remaining?: number | null
          interest_rate?: number | null
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
          installments_remaining?: number | null
          interest_rate?: number | null
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
      decision_rules: {
        Row: {
          created_at: string | null
          default_action: string | null
          id: string
          level_1: Json | null
          level_2: Json | null
          level_3: Json | null
          primary_trigger: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          default_action?: string | null
          id?: string
          level_1?: Json | null
          level_2?: Json | null
          level_3?: Json | null
          primary_trigger?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          default_action?: string | null
          id?: string
          level_1?: Json | null
          level_2?: Json | null
          level_3?: Json | null
          primary_trigger?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      emergency_fund: {
        Row: {
          account_info: string | null
          account_type: string | null
          auto_transfer: boolean | null
          created_at: string | null
          current_balance: number | null
          goal_amount: number | null
          id: string
          monthly_contribution: number | null
          transfer_day: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          account_info?: string | null
          account_type?: string | null
          auto_transfer?: boolean | null
          created_at?: string | null
          current_balance?: number | null
          goal_amount?: number | null
          id?: string
          monthly_contribution?: number | null
          transfer_day?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          account_info?: string | null
          account_type?: string | null
          auto_transfer?: boolean | null
          created_at?: string | null
          current_balance?: number | null
          goal_amount?: number | null
          id?: string
          monthly_contribution?: number | null
          transfer_day?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      financial_snapshot: {
        Row: {
          balance: number
          created_at: string | null
          emotional_note: string | null
          id: string
          total_debt_amount: number
          total_debt_payments: number
          total_fixed: number
          total_income: number
          total_variable: number
          updated_at: string | null
          user_id: string
        }
        Insert: {
          balance?: number
          created_at?: string | null
          emotional_note?: string | null
          id?: string
          total_debt_amount?: number
          total_debt_payments?: number
          total_fixed?: number
          total_income?: number
          total_variable?: number
          updated_at?: string | null
          user_id: string
        }
        Update: {
          balance?: number
          created_at?: string | null
          emotional_note?: string | null
          id?: string
          total_debt_amount?: number
          total_debt_payments?: number
          total_fixed?: number
          total_income?: number
          total_variable?: number
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      fixed_expenses: {
        Row: {
          amount: number
          auto_debit: boolean | null
          category: string | null
          classification: string | null
          created_at: string | null
          due_date: number | null
          id: string
          name: string
          notes: string | null
          payment_method: string | null
          priority: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          amount: number
          auto_debit?: boolean | null
          category?: string | null
          classification?: string | null
          created_at?: string | null
          due_date?: number | null
          id?: string
          name: string
          notes?: string | null
          payment_method?: string | null
          priority?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          amount?: number
          auto_debit?: boolean | null
          category?: string | null
          classification?: string | null
          created_at?: string | null
          due_date?: number | null
          id?: string
          name?: string
          notes?: string | null
          payment_method?: string | null
          priority?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      income_items: {
        Row: {
          amount: number
          created_at: string | null
          id: string
          notes: string | null
          received_on: number | null
          recurrence: string | null
          source: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string | null
          id?: string
          notes?: string | null
          received_on?: number | null
          recurrence?: string | null
          source: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string | null
          id?: string
          notes?: string | null
          received_on?: number | null
          recurrence?: string | null
          source?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      initial_assessment: {
        Row: {
          biggest_blocker: string
          created_at: string | null
          has_overdue_bills: string
          id: string
          main_goal: string
          money_feeling: string
          monthly_income: number
          shares_finances: boolean
          shares_with: string | null
          top_expenses: Json
          tried_before: boolean
          updated_at: string | null
          user_id: string
          what_blocked: string | null
        }
        Insert: {
          biggest_blocker: string
          created_at?: string | null
          has_overdue_bills: string
          id?: string
          main_goal: string
          money_feeling: string
          monthly_income: number
          shares_finances?: boolean
          shares_with?: string | null
          top_expenses?: Json
          tried_before?: boolean
          updated_at?: string | null
          user_id: string
          what_blocked?: string | null
        }
        Update: {
          biggest_blocker?: string
          created_at?: string | null
          has_overdue_bills?: string
          id?: string
          main_goal?: string
          money_feeling?: string
          monthly_income?: number
          shares_finances?: boolean
          shares_with?: string | null
          top_expenses?: Json
          tried_before?: boolean
          updated_at?: string | null
          user_id?: string
          what_blocked?: string | null
        }
        Relationships: []
      }
      library_items: {
        Row: {
          category: string
          created_at: string
          description: string | null
          group_label: string | null
          id: string
          label: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          category: string
          created_at?: string
          description?: string | null
          group_label?: string | null
          id?: string
          label: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          description?: string | null
          group_label?: string | null
          id?: string
          label?: string
          sort_order?: number
          updated_at?: string
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
      negotiation_plans: {
        Row: {
          contact_email: string | null
          contact_hours: string | null
          contact_phone: string | null
          created_at: string | null
          debt_id: string | null
          documents_needed: string | null
          id: string
          ideal_monthly_payment: number | null
          key_arguments: string | null
          max_monthly_payment: number | null
          objective: string | null
          priority: string | null
          scheduled_at: string | null
          scripts: string | null
          status: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          contact_email?: string | null
          contact_hours?: string | null
          contact_phone?: string | null
          created_at?: string | null
          debt_id?: string | null
          documents_needed?: string | null
          id?: string
          ideal_monthly_payment?: number | null
          key_arguments?: string | null
          max_monthly_payment?: number | null
          objective?: string | null
          priority?: string | null
          scheduled_at?: string | null
          scripts?: string | null
          status?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          contact_email?: string | null
          contact_hours?: string | null
          contact_phone?: string | null
          created_at?: string | null
          debt_id?: string | null
          documents_needed?: string | null
          id?: string
          ideal_monthly_payment?: number | null
          key_arguments?: string | null
          max_monthly_payment?: number | null
          objective?: string | null
          priority?: string | null
          scheduled_at?: string | null
          scripts?: string | null
          status?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "negotiation_plans_debt_id_fkey"
            columns: ["debt_id"]
            isOneToOne: false
            referencedRelation: "debts"
            referencedColumns: ["id"]
          },
        ]
      }
      negotiation_sessions: {
        Row: {
          completed_at: string | null
          created_at: string | null
          id: string
          negotiation_plan_id: string
          next_steps: string | null
          notes: string | null
          proposed_entry_value: number | null
          proposed_installments: number | null
          proposed_interest: number | null
          proposed_monthly_value: number | null
          proposed_total_value: number | null
          scheduled_at: string | null
          status: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string | null
          id?: string
          negotiation_plan_id: string
          next_steps?: string | null
          notes?: string | null
          proposed_entry_value?: number | null
          proposed_installments?: number | null
          proposed_interest?: number | null
          proposed_monthly_value?: number | null
          proposed_total_value?: number | null
          scheduled_at?: string | null
          status?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string | null
          id?: string
          negotiation_plan_id?: string
          next_steps?: string | null
          notes?: string | null
          proposed_entry_value?: number | null
          proposed_installments?: number | null
          proposed_interest?: number | null
          proposed_monthly_value?: number | null
          proposed_total_value?: number | null
          scheduled_at?: string | null
          status?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "negotiation_sessions_negotiation_plan_id_fkey"
            columns: ["negotiation_plan_id"]
            isOneToOne: false
            referencedRelation: "negotiation_plans"
            referencedColumns: ["id"]
          },
        ]
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
      plan_checkpoints: {
        Row: {
          completed: boolean | null
          completed_at: string | null
          created_at: string | null
          id: string
          name: string
          notes: string | null
          plan_id: string
          target_date: string | null
          updated_at: string | null
        }
        Insert: {
          completed?: boolean | null
          completed_at?: string | null
          created_at?: string | null
          id?: string
          name: string
          notes?: string | null
          plan_id: string
          target_date?: string | null
          updated_at?: string | null
        }
        Update: {
          completed?: boolean | null
          completed_at?: string | null
          created_at?: string | null
          id?: string
          name?: string
          notes?: string | null
          plan_id?: string
          target_date?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "plan_checkpoints_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "plans"
            referencedColumns: ["id"]
          },
        ]
      }
      plan_debt_priorities: {
        Row: {
          action_type: string
          created_at: string | null
          debt_id: string | null
          id: string
          notes: string | null
          plan_id: string
          priority: number | null
          updated_at: string | null
        }
        Insert: {
          action_type: string
          created_at?: string | null
          debt_id?: string | null
          id?: string
          notes?: string | null
          plan_id: string
          priority?: number | null
          updated_at?: string | null
        }
        Update: {
          action_type?: string
          created_at?: string | null
          debt_id?: string | null
          id?: string
          notes?: string | null
          plan_id?: string
          priority?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "plan_debt_priorities_debt_id_fkey"
            columns: ["debt_id"]
            isOneToOne: false
            referencedRelation: "debts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "plan_debt_priorities_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "plans"
            referencedColumns: ["id"]
          },
        ]
      }
      plan_essentials: {
        Row: {
          created_at: string | null
          due_date: number | null
          id: string
          minimum_amount: number
          name: string
          plan_id: string
          sort_order: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          due_date?: number | null
          id?: string
          minimum_amount: number
          name: string
          plan_id: string
          sort_order?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          due_date?: number | null
          id?: string
          minimum_amount?: number
          name?: string
          plan_id?: string
          sort_order?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "plan_essentials_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "plans"
            referencedColumns: ["id"]
          },
        ]
      }
      plan_levers: {
        Row: {
          completed: boolean | null
          created_at: string | null
          goal_text: string
          id: string
          plan_id: string
          success_criteria: string | null
          type: string
          updated_at: string | null
          weekly_action: string | null
        }
        Insert: {
          completed?: boolean | null
          created_at?: string | null
          goal_text: string
          id?: string
          plan_id: string
          success_criteria?: string | null
          type: string
          updated_at?: string | null
          weekly_action?: string | null
        }
        Update: {
          completed?: boolean | null
          created_at?: string | null
          goal_text?: string
          id?: string
          plan_id?: string
          success_criteria?: string | null
          type?: string
          updated_at?: string | null
          weekly_action?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "plan_levers_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "plans"
            referencedColumns: ["id"]
          },
        ]
      }
      plans: {
        Row: {
          commitment_phrase: string | null
          created_at: string | null
          cycle_type: string
          end_date: string | null
          id: string
          mode: string | null
          start_date: string
          status: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          commitment_phrase?: string | null
          created_at?: string | null
          cycle_type: string
          end_date?: string | null
          id?: string
          mode?: string | null
          start_date: string
          status?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          commitment_phrase?: string | null
          created_at?: string | null
          cycle_type?: string
          end_date?: string | null
          id?: string
          mode?: string | null
          start_date?: string
          status?: string | null
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
          level: number | null
          role: string | null
          updated_at: string | null
          xp_total: number | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          email: string
          full_name?: string
          id: string
          level?: number | null
          role?: string | null
          updated_at?: string | null
          xp_total?: number | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string
          full_name?: string
          id?: string
          level?: number | null
          role?: string | null
          updated_at?: string | null
          xp_total?: number | null
        }
        Relationships: []
      }
      progress_dashboard: {
        Row: {
          certificate_generated_at: string | null
          certificate_url: string | null
          commitment_phrase: string | null
          created_at: string | null
          id: string
          indicators: Json
          updated_at: string | null
          user_id: string
        }
        Insert: {
          certificate_generated_at?: string | null
          certificate_url?: string | null
          commitment_phrase?: string | null
          created_at?: string | null
          id?: string
          indicators?: Json
          updated_at?: string | null
          user_id: string
        }
        Update: {
          certificate_generated_at?: string | null
          certificate_url?: string | null
          commitment_phrase?: string | null
          created_at?: string | null
          id?: string
          indicators?: Json
          updated_at?: string | null
          user_id?: string
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
      shadow_expenses: {
        Row: {
          action_taken_at: string | null
          comment: string | null
          created_at: string | null
          estimated_amount: number | null
          frequency: string | null
          id: string
          monthly_limit: number | null
          name: string
          status: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          action_taken_at?: string | null
          comment?: string | null
          created_at?: string | null
          estimated_amount?: number | null
          frequency?: string | null
          id?: string
          monthly_limit?: number | null
          name: string
          status?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          action_taken_at?: string | null
          comment?: string | null
          created_at?: string | null
          estimated_amount?: number | null
          frequency?: string | null
          id?: string
          monthly_limit?: number | null
          name?: string
          status?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      spending_rules: {
        Row: {
          banned_list: Json
          created_at: string | null
          exceptions: Json
          id: string
          total_limit: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          banned_list?: Json
          created_at?: string | null
          exceptions?: Json
          id?: string
          total_limit?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          banned_list?: Json
          created_at?: string | null
          exceptions?: Json
          id?: string
          total_limit?: number | null
          updated_at?: string | null
          user_id?: string
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
      transactions: {
        Row: {
          amount: number
          category: string | null
          created_at: string | null
          date: string
          description: string
          id: string
          is_shadow: boolean | null
          source: string | null
          status: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          amount: number
          category?: string | null
          created_at?: string | null
          date: string
          description: string
          id?: string
          is_shadow?: boolean | null
          source?: string | null
          status?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          amount?: number
          category?: string | null
          created_at?: string | null
          date?: string
          description?: string
          id?: string
          is_shadow?: boolean | null
          source?: string | null
          status?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_commitment: {
        Row: {
          created_at: string | null
          daily_time_exact: string
          daily_time_period: string
          id: string
          minimum_step: string
          reminder_channels: Json
          reminder_enabled: boolean | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          daily_time_exact: string
          daily_time_period: string
          id?: string
          minimum_step: string
          reminder_channels?: Json
          reminder_enabled?: boolean | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          daily_time_exact?: string
          daily_time_period?: string
          id?: string
          minimum_step?: string
          reminder_channels?: Json
          reminder_enabled?: boolean | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_profile: {
        Row: {
          anxiety_score: number | null
          clarity_score: number | null
          created_at: string | null
          current_day: number | null
          fixed_time: string | null
          id: string
          no_new_debt_commitment: boolean | null
          onboarding_completed: boolean | null
          sources: string[] | null
          timezone: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          anxiety_score?: number | null
          clarity_score?: number | null
          created_at?: string | null
          current_day?: number | null
          fixed_time?: string | null
          id?: string
          no_new_debt_commitment?: boolean | null
          onboarding_completed?: boolean | null
          sources?: string[] | null
          timezone?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          anxiety_score?: number | null
          clarity_score?: number | null
          created_at?: string | null
          current_day?: number | null
          fixed_time?: string | null
          id?: string
          no_new_debt_commitment?: boolean | null
          onboarding_completed?: boolean | null
          sources?: string[] | null
          timezone?: string | null
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
      variable_expenses: {
        Row: {
          amount: number
          category: string | null
          classification: string | null
          created_at: string | null
          id: string
          is_essential: boolean | null
          monthly_average: number | null
          name: string
          notes: string | null
          spent_on: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          amount: number
          category?: string | null
          classification?: string | null
          created_at?: string | null
          id?: string
          is_essential?: boolean | null
          monthly_average?: number | null
          name: string
          notes?: string | null
          spent_on: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          amount?: number
          category?: string | null
          classification?: string | null
          created_at?: string | null
          id?: string
          is_essential?: boolean | null
          monthly_average?: number | null
          name?: string
          notes?: string | null
          spent_on?: string
          updated_at?: string | null
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
      reset_user_data: { Args: never; Returns: undefined }
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
