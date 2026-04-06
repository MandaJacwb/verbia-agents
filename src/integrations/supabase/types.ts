export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
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
          }
        ]
      }
      campaigns: {
        Row: {
          account_id: string
          channel: string
          config: Json | null
          created_at: string
          description: string | null
          ended_at: string | null
          id: string
          name: string
          objectives: Json | null
          started_at: string | null
          status: string
          updated_at: string
        }
        Insert: {
          account_id: string
          channel: string
          config?: Json | null
          created_at?: string
          description?: string | null
          ended_at?: string | null
          id?: string
          name: string
          objectives?: Json | null
          started_at?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          account_id?: string
          channel?: string
          config?: Json | null
          created_at?: string
          description?: string | null
          ended_at?: string | null
          id?: string
          name?: string
          objectives?: Json | null
          started_at?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "campaigns_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          }
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
          }
        ]
      }
      crm_leads: {
        Row: {
          attempt_count: number
          channel: string | null
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
          company_id: string | null
        }
        Insert: {
          attempt_count?: number
          channel?: string | null
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
          company_id?: string | null
        }
        Update: {
          attempt_count?: number
          channel?: string | null
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
          company_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "crm_leads_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "crm_contacts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "crm_leads_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "crm_companies"
            referencedColumns: ["id"]
          }
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
            foreignKeyName: "crm_message_events_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "crm_leads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "crm_message_events_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "crm_contacts"
            referencedColumns: ["id"]
          }
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
          }
        ]
      }
    }
    Views: {}
    Functions: {}
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
    CompositeTypes: {}
  }
}
