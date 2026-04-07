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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      accounts: {
        Row: {
          cnpj: string | null
          created_at: string
          id: string
          name: string
          plan: string
          status: string
          updated_at: string
        }
        Insert: {
          cnpj?: string | null
          created_at?: string
          id?: string
          name: string
          plan?: string
          status?: string
          updated_at?: string
        }
        Update: {
          cnpj?: string | null
          created_at?: string
          id?: string
          name?: string
          plan?: string
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      agents: {
        Row: {
          account_id: string
          active: boolean
          config: Json
          created_at: string
          description: string | null
          id: string
          n8n_webhook_url: string | null
          name: string
          objective: string | null
          tone: string
          updated_at: string
        }
        Insert: {
          account_id: string
          active?: boolean
          config?: Json
          created_at?: string
          description?: string | null
          id?: string
          n8n_webhook_url?: string | null
          name: string
          objective?: string | null
          tone?: string
          updated_at?: string
        }
        Update: {
          account_id?: string
          active?: boolean
          config?: Json
          created_at?: string
          description?: string | null
          id?: string
          n8n_webhook_url?: string | null
          name?: string
          objective?: string | null
          tone?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "agents_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      campaigns: {
        Row: {
          account_id: string
          channel: string
          created_at: string
          id: string
          name: string
          scheduled_at: string | null
          sent_count: number
          status: string
          template_id: string | null
          total_recipients: number
          updated_at: string
        }
        Insert: {
          account_id: string
          channel?: string
          created_at?: string
          id?: string
          name: string
          scheduled_at?: string | null
          sent_count?: number
          status?: string
          template_id?: string | null
          total_recipients?: number
          updated_at?: string
        }
        Update: {
          account_id?: string
          channel?: string
          created_at?: string
          id?: string
          name?: string
          scheduled_at?: string | null
          sent_count?: number
          status?: string
          template_id?: string | null
          total_recipients?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "campaigns_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "campaigns_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "message_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      contacts: {
        Row: {
          account_id: string
          company: string | null
          created_at: string
          email: string | null
          id: string
          metadata: Json | null
          name: string
          phone: string | null
          tags: string[] | null
          updated_at: string
        }
        Insert: {
          account_id: string
          company?: string | null
          created_at?: string
          email?: string | null
          id?: string
          metadata?: Json | null
          name: string
          phone?: string | null
          tags?: string[] | null
          updated_at?: string
        }
        Update: {
          account_id?: string
          company?: string | null
          created_at?: string
          email?: string | null
          id?: string
          metadata?: Json | null
          name?: string
          phone?: string | null
          tags?: string[] | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "contacts_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      conversations: {
        Row: {
          account_id: string
          agent_id: string | null
          channel: string
          contact_id: string | null
          created_at: string
          id: string
          status: string
          updated_at: string
        }
        Insert: {
          account_id: string
          agent_id?: string | null
          channel?: string
          contact_id?: string | null
          created_at?: string
          id?: string
          status?: string
          updated_at?: string
        }
        Update: {
          account_id?: string
          agent_id?: string | null
          channel?: string
          contact_id?: string | null
          created_at?: string
          id?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "conversations_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "conversations_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "agents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "conversations_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "contacts"
            referencedColumns: ["id"]
          },
        ]
      }
      crm_companies: {
        Row: {
          city: string | null
          created_at: string
          delivery_volume: string | null
          district: string | null
          id: string
          name: string
          segment: string | null
          updated_at: string
        }
        Insert: {
          city?: string | null
          created_at?: string
          delivery_volume?: string | null
          district?: string | null
          id?: string
          name: string
          segment?: string | null
          updated_at?: string
        }
        Update: {
          city?: string | null
          created_at?: string
          delivery_volume?: string | null
          district?: string | null
          id?: string
          name?: string
          segment?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      crm_contacts: {
        Row: {
          city: string | null
          created_at: string
          district: string | null
          email: string | null
          full_name: string | null
          id: string
          instagram_handle: string | null
          job_title: string | null
          phone_e164: string | null
          phone_raw: string | null
          source: string | null
          updated_at: string
        }
        Insert: {
          city?: string | null
          created_at?: string
          district?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          instagram_handle?: string | null
          job_title?: string | null
          phone_e164?: string | null
          phone_raw?: string | null
          source?: string | null
          updated_at?: string
        }
        Update: {
          city?: string | null
          created_at?: string
          district?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          instagram_handle?: string | null
          job_title?: string | null
          phone_e164?: string | null
          phone_raw?: string | null
          source?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      crm_event_logs: {
        Row: {
          correlation_id: string | null
          created_at: string
          event_source: string | null
          event_type: string
          id: string
          lead_id: string | null
          payload: Json
        }
        Insert: {
          correlation_id?: string | null
          created_at?: string
          event_source?: string | null
          event_type: string
          id?: string
          lead_id?: string | null
          payload?: Json
        }
        Update: {
          correlation_id?: string | null
          created_at?: string
          event_source?: string | null
          event_type?: string
          id?: string
          lead_id?: string | null
          payload?: Json
        }
        Relationships: [
          {
            foreignKeyName: "crm_event_logs_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "crm_leads"
            referencedColumns: ["id"]
          },
        ]
      }
      crm_leads: {
        Row: {
          attempt_count: number
          channel: string | null
          company_id: string | null
          contact_id: string | null
          cooldown_until: string | null
          correlation_id: string | null
          created_at: string
          decision_maker: boolean
          disqualify_reason: string | null
          do_not_contact: boolean
          do_not_contact_reason: string | null
          external_ref: string | null
          id: string
          last_contact_at: string | null
          last_reply_at: string | null
          lead_payload: Json
          lead_status: Database["public"]["Enums"]["crm_lead_status"]
          lifecycle_stage: Database["public"]["Enums"]["crm_lifecycle_stage"]
          meeting_at: string | null
          next_step: string | null
          owner_name: string | null
          pain_points: string[]
          pipeline_stage: Database["public"]["Enums"]["crm_pipeline_stage"]
          qualification: string | null
          score: number
          score_features: Json
          sla_need: string | null
          source_channel: string | null
          unsubscribe_at: string | null
          unsubscribe_source: string | null
          updated_at: string
        }
        Insert: {
          attempt_count?: number
          channel?: string | null
          company_id?: string | null
          contact_id?: string | null
          cooldown_until?: string | null
          correlation_id?: string | null
          created_at?: string
          decision_maker?: boolean
          disqualify_reason?: string | null
          do_not_contact?: boolean
          do_not_contact_reason?: string | null
          external_ref?: string | null
          id?: string
          last_contact_at?: string | null
          last_reply_at?: string | null
          lead_payload?: Json
          lead_status?: Database["public"]["Enums"]["crm_lead_status"]
          lifecycle_stage?: Database["public"]["Enums"]["crm_lifecycle_stage"]
          meeting_at?: string | null
          next_step?: string | null
          owner_name?: string | null
          pain_points?: string[]
          pipeline_stage?: Database["public"]["Enums"]["crm_pipeline_stage"]
          qualification?: string | null
          score?: number
          score_features?: Json
          sla_need?: string | null
          source_channel?: string | null
          unsubscribe_at?: string | null
          unsubscribe_source?: string | null
          updated_at?: string
        }
        Update: {
          attempt_count?: number
          channel?: string | null
          company_id?: string | null
          contact_id?: string | null
          cooldown_until?: string | null
          correlation_id?: string | null
          created_at?: string
          decision_maker?: boolean
          disqualify_reason?: string | null
          do_not_contact?: boolean
          do_not_contact_reason?: string | null
          external_ref?: string | null
          id?: string
          last_contact_at?: string | null
          last_reply_at?: string | null
          lead_payload?: Json
          lead_status?: Database["public"]["Enums"]["crm_lead_status"]
          lifecycle_stage?: Database["public"]["Enums"]["crm_lifecycle_stage"]
          meeting_at?: string | null
          next_step?: string | null
          owner_name?: string | null
          pain_points?: string[]
          pipeline_stage?: Database["public"]["Enums"]["crm_pipeline_stage"]
          qualification?: string | null
          score?: number
          score_features?: Json
          sla_need?: string | null
          source_channel?: string | null
          unsubscribe_at?: string | null
          unsubscribe_source?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "crm_leads_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "crm_companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "crm_leads_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "crm_contacts"
            referencedColumns: ["id"]
          },
        ]
      }
      crm_message_events: {
        Row: {
          channel: string
          contact_id: string | null
          correlation_id: string | null
          created_at: string
          direction: string
          id: string
          intent: string | null
          lead_id: string | null
          message_status: string | null
          message_text: string | null
          provider: string | null
          provider_message_id: string | null
          raw_payload: Json
        }
        Insert: {
          channel: string
          contact_id?: string | null
          correlation_id?: string | null
          created_at?: string
          direction: string
          id?: string
          intent?: string | null
          lead_id?: string | null
          message_status?: string | null
          message_text?: string | null
          provider?: string | null
          provider_message_id?: string | null
          raw_payload?: Json
        }
        Update: {
          channel?: string
          contact_id?: string | null
          correlation_id?: string | null
          created_at?: string
          direction?: string
          id?: string
          intent?: string | null
          lead_id?: string | null
          message_status?: string | null
          message_text?: string | null
          provider?: string | null
          provider_message_id?: string | null
          raw_payload?: Json
        }
        Relationships: [
          {
            foreignKeyName: "crm_message_events_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "crm_contacts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "crm_message_events_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "crm_leads"
            referencedColumns: ["id"]
          },
        ]
      }
      crm_owners: {
        Row: {
          active: boolean
          created_at: string
          id: string
          owner_name: string
          owner_type: string
          region: string | null
          round_robin_order: number
        }
        Insert: {
          active?: boolean
          created_at?: string
          id?: string
          owner_name: string
          owner_type?: string
          region?: string | null
          round_robin_order?: number
        }
        Update: {
          active?: boolean
          created_at?: string
          id?: string
          owner_name?: string
          owner_type?: string
          region?: string | null
          round_robin_order?: number
        }
        Relationships: []
      }
      crm_tasks: {
        Row: {
          channel: string | null
          correlation_id: string | null
          created_at: string
          description: string | null
          due_at: string | null
          id: string
          lead_id: string
          priority: string | null
          related_message_id: string | null
          status: Database["public"]["Enums"]["crm_task_status"]
          task_type: string
          title: string
          updated_at: string
        }
        Insert: {
          channel?: string | null
          correlation_id?: string | null
          created_at?: string
          description?: string | null
          due_at?: string | null
          id?: string
          lead_id: string
          priority?: string | null
          related_message_id?: string | null
          status?: Database["public"]["Enums"]["crm_task_status"]
          task_type: string
          title: string
          updated_at?: string
        }
        Update: {
          channel?: string | null
          correlation_id?: string | null
          created_at?: string
          description?: string | null
          due_at?: string | null
          id?: string
          lead_id?: string
          priority?: string | null
          related_message_id?: string | null
          status?: Database["public"]["Enums"]["crm_task_status"]
          task_type?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "crm_tasks_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "crm_leads"
            referencedColumns: ["id"]
          },
        ]
      }
      interactions: {
        Row: {
          account_id: string | null
          action: string
          agent_name: string
          created_at: string
          id: string
          contact_name: string | null
          interaction_type: string
          is_hot: boolean
          lead_name: string
          message_content: string | null
          phone_number: string | null
        }
        Insert: {
          account_id?: string | null
          action: string
          agent_name: string
          contact_name?: string | null
          created_at?: string
          id?: string
          interaction_type?: string
          is_hot?: boolean
          lead_name: string
          message_content?: string | null
          phone_number?: string | null
        }
        Update: {
          account_id?: string | null
          action?: string
          agent_name?: string
          contact_name?: string | null
          created_at?: string
          id?: string
          interaction_type?: string
          is_hot?: boolean
          lead_name?: string
          message_content?: string | null
          phone_number?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "interactions_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      leads: {
        Row: {
          account_id: string
          agent_id: string | null
          contact_id: string | null
          created_at: string
          id: string
          is_hot: boolean
          notes: string | null
          score: number
          status: string
          updated_at: string
        }
        Insert: {
          account_id: string
          agent_id?: string | null
          contact_id?: string | null
          created_at?: string
          id?: string
          is_hot?: boolean
          notes?: string | null
          score?: number
          status?: string
          updated_at?: string
        }
        Update: {
          account_id?: string
          agent_id?: string | null
          contact_id?: string | null
          created_at?: string
          id?: string
          is_hot?: boolean
          notes?: string | null
          score?: number
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "leads_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "leads_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "agents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "leads_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "contacts"
            referencedColumns: ["id"]
          },
        ]
      }
      message_templates: {
        Row: {
          account_id: string
          category: string
          content: string
          created_at: string
          id: string
          name: string
          updated_at: string
          variables: string[] | null
        }
        Insert: {
          account_id: string
          category?: string
          content: string
          created_at?: string
          id?: string
          name: string
          updated_at?: string
          variables?: string[] | null
        }
        Update: {
          account_id?: string
          category?: string
          content?: string
          created_at?: string
          id?: string
          name?: string
          updated_at?: string
          variables?: string[] | null
        }
        Relationships: [
          {
            foreignKeyName: "message_templates_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          account_id: string
          content: string
          conversation_id: string
          created_at: string
          id: string
          role: string
        }
        Insert: {
          account_id: string
          content: string
          conversation_id: string
          created_at?: string
          id?: string
          role: string
        }
        Update: {
          account_id?: string
          content?: string
          conversation_id?: string
          created_at?: string
          id?: string
          role?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          account_id: string
          avatar_url: string | null
          created_at: string
          full_name: string | null
          id: string
          role: string
          updated_at: string
        }
        Insert: {
          account_id: string
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id: string
          role?: string
          updated_at?: string
        }
        Update: {
          account_id?: string
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          role?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_my_account_id: { Args: never; Returns: string }
      get_my_role: { Args: never; Returns: string }
    }
    Enums: {
      crm_lead_status:
        | "new"
        | "waiting_reply"
        | "nurture"
        | "qualified"
        | "disqualified"
        | "meeting_set"
        | "opt_out"
        | "customer_redirected"
        | "support_redirected"
      crm_lifecycle_stage:
        | "lead"
        | "mql"
        | "sql"
        | "opportunity"
        | "customer"
        | "post_sale"
      crm_pipeline_stage:
        | "novo_lead"
        | "qualificacao_sdr"
        | "handoff_closer"
        | "reuniao"
        | "duvidas"
        | "contrato"
        | "onboarding"
        | "pos_venda"
      crm_task_status: "open" | "in_progress" | "completed" | "cancelled"
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
      crm_lead_status: [
        "new",
        "waiting_reply",
        "nurture",
        "qualified",
        "disqualified",
        "meeting_set",
        "opt_out",
        "customer_redirected",
        "support_redirected",
      ],
      crm_lifecycle_stage: [
        "lead",
        "mql",
        "sql",
        "opportunity",
        "customer",
        "post_sale",
      ],
      crm_pipeline_stage: [
        "novo_lead",
        "qualificacao_sdr",
        "handoff_closer",
        "reuniao",
        "duvidas",
        "contrato",
        "onboarding",
        "pos_venda",
      ],
      crm_task_status: ["open", "in_progress", "completed", "cancelled"],
    },
  },
} as const
