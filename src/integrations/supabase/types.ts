export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      posts: {
        Row: {
          created_at: string | null
          description: string
          id: number               // <-- AJUSTADO
          title: string
          updated_at: string | null
          user_id: number          // <-- AJUSTADO
        }
        Insert: {
          created_at?: string | null
          description: string
          id?: number              // <-- AJUSTADO
          title: string
          updated_at?: string | null
          user_id: number          // <-- AJUSTADO
        }
        Update: {
          created_at?: string | null
          description?: string
          id?: number              // <-- AJUSTADO
          title?: string
          updated_at?: string | null
          user_id?: number         // <-- AJUSTADO
        }
        Relationships: [
          {
            foreignKeyName: "posts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }

      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          id: number               // <-- AJUSTADO
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          id: number               // <-- AJUSTADO
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          id?: number              // <-- AJUSTADO
          username?: string | null
        }
        Relationships: []
      }
    }

    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
