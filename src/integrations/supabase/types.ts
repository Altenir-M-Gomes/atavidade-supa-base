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
          id: number
          titulo: string
          conteudo: string
          autor: string
          data_publicacao: string
        }
        Insert: {
          id?: number
          titulo: string
          conteudo: string
          autor: string
          data_publicacao: string
        }
        Update: {
          id?: number
          titulo?: string
          conteudo?: string
          autor?: string
          data_publicacao?: string
        }
        Relationships: []
      }

      comentarios: {
        Row: {
          id: number
          id_post: number
          nome: string
          email: string | null
          mensagem: string
          data: string
        }
        Insert: {
          id?: number
          id_post: number
          nome: string
          email?: string | null
          mensagem: string
          data: string
        }
        Update: {
          id?: number
          id_post?: number
          nome?: string
          email?: string | null
          mensagem?: string
          data?: string
        }
        Relationships: [
          {
            foreignKeyName: "comentarios_id_post_fkey"
            columns: ["id_post"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          }
        ]
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

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals["public"]

export type Tables<
  T extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  U extends T extends { schema: keyof DatabaseWithoutInternals }
    ? keyof (DatabaseWithoutInternals[T["schema"]]["Tables"] &
        DatabaseWithoutInternals[T["schema"]]["Views"])
    : never = never,
> = T extends { schema: keyof DatabaseWithoutInternals }
  ? (DatabaseWithoutInternals[T["schema"]]["Tables"] &
      DatabaseWithoutInternals[T["schema"]]["Views"])[U] extends {
      Row: infer R
    }
    ? R
    : never
  : T extends keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[T] extends { Row: infer R }
      ? R
      : never
    : never

export type TablesInsert<
  T extends keyof DefaultSchema["Tables"] | { schema: keyof DatabaseWithoutInternals },
  U extends T extends { schema: keyof DatabaseWithoutInternals }
    ? keyof DatabaseWithoutInternals[T["schema"]]["Tables"]
    : never = never,
> = T extends { schema: keyof DatabaseWithoutInternals }
  ? DatabaseWithoutInternals[T["schema"]]["Tables"][U] extends {
      Insert: infer I
    }
    ? I
    : never
  : T extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][T] extends { Insert: infer I }
      ? I
      : never
    : never

export type TablesUpdate<
  T extends keyof DefaultSchema["Tables"] | { schema: keyof DatabaseWithoutInternals },
  U extends T extends { schema: keyof DatabaseWithoutInternals }
    ? keyof DatabaseWithoutInternals[T["schema"]]["Tables"]
    : never = never,
> = T extends { schema: keyof DatabaseWithoutInternals }
  ? DatabaseWithoutInternals[T["schema"]]["Tables"][U] extends {
      Update: infer U2
    }
    ? U2
    : never
  : T extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][T] extends { Update: infer U2 }
      ? U2
      : never
    : never

export type Enums<
  T extends keyof DefaultSchema["Enums"] | { schema: keyof DatabaseWithoutInternals },
  U extends T extends { schema: keyof DatabaseWithoutInternals }
    ? keyof DatabaseWithoutInternals[T["schema"]]["Enums"]
    : never = never,
> = T extends { schema: keyof DatabaseWithoutInternals }
  ? DatabaseWithoutInternals[T["schema"]]["Enums"][U]
  : T extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][T]
    : never

export type CompositeTypes<
  T extends keyof DefaultSchema["CompositeTypes"] | { schema: keyof DatabaseWithoutInternals },
  U extends T extends { schema: keyof DatabaseWithoutInternals }
    ? keyof DatabaseWithoutInternals[T["schema"]]["CompositeTypes"]
    : never = never,
> = T extends { schema: keyof DatabaseWithoutInternals }
  ? DatabaseWithoutInternals[T["schema"]]["CompositeTypes"][U]
  : T extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][T]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
