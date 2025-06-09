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
      activities: {
        Row: {
          activity_type: string
          camera_id: string | null
          created_at: string
          description: string
          id: string
          location: string | null
          metadata: Json | null
        }
        Insert: {
          activity_type: string
          camera_id?: string | null
          created_at?: string
          description: string
          id?: string
          location?: string | null
          metadata?: Json | null
        }
        Update: {
          activity_type?: string
          camera_id?: string | null
          created_at?: string
          description?: string
          id?: string
          location?: string | null
          metadata?: Json | null
        }
        Relationships: []
      }
      alerts: {
        Row: {
          alert_type: string
          camera_id: string | null
          created_at: string
          description: string
          id: string
          location: string | null
          resolved_at: string | null
          status: string
          title: string
        }
        Insert: {
          alert_type: string
          camera_id?: string | null
          created_at?: string
          description: string
          id?: string
          location?: string | null
          resolved_at?: string | null
          status?: string
          title: string
        }
        Update: {
          alert_type?: string
          camera_id?: string | null
          created_at?: string
          description?: string
          id?: string
          location?: string | null
          resolved_at?: string | null
          status?: string
          title?: string
        }
        Relationships: []
      }
      analytics_data: {
        Row: {
          camera_id: string | null
          created_at: string
          hour_timestamp: string
          id: string
          location: string | null
          metric_type: string
          value: number
        }
        Insert: {
          camera_id?: string | null
          created_at?: string
          hour_timestamp: string
          id?: string
          location?: string | null
          metric_type: string
          value: number
        }
        Update: {
          camera_id?: string | null
          created_at?: string
          hour_timestamp?: string
          id?: string
          location?: string | null
          metric_type?: string
          value?: number
        }
        Relationships: []
      }
      cameras: {
        Row: {
          created_at: string
          detection_count: number
          id: string
          last_detection: string | null
          location: string
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          detection_count?: number
          id: string
          last_detection?: string | null
          location: string
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          detection_count?: number
          id?: string
          last_detection?: string | null
          location?: string
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      goods: {
        Row: {
          batch_id: string | null
          camera_id: string | null
          confidence_score: number | null
          created_at: string
          detected_at: string
          id: string
          item_name: string
          location: string
          quantity: number
          status: string
          updated_at: string
        }
        Insert: {
          batch_id?: string | null
          camera_id?: string | null
          confidence_score?: number | null
          created_at?: string
          detected_at?: string
          id?: string
          item_name: string
          location: string
          quantity?: number
          status?: string
          updated_at?: string
        }
        Update: {
          batch_id?: string | null
          camera_id?: string | null
          confidence_score?: number | null
          created_at?: string
          detected_at?: string
          id?: string
          item_name?: string
          location?: string
          quantity?: number
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      kpi_snapshots: {
        Row: {
          created_at: string
          detection_accuracy: number
          goods_transported: number
          id: string
          snapshot_date: string
          system_uptime: number
          vehicles_detected: number
        }
        Insert: {
          created_at?: string
          detection_accuracy?: number
          goods_transported?: number
          id?: string
          snapshot_date?: string
          system_uptime?: number
          vehicles_detected?: number
        }
        Update: {
          created_at?: string
          detection_accuracy?: number
          goods_transported?: number
          id?: string
          snapshot_date?: string
          system_uptime?: number
          vehicles_detected?: number
        }
        Relationships: []
      }
      vehicles: {
        Row: {
          camera_id: string | null
          confidence_score: number | null
          created_at: string
          detected_at: string
          driver_name: string | null
          id: string
          license_plate: string
          location: string
          status: string
          updated_at: string
          vehicle_type: string
        }
        Insert: {
          camera_id?: string | null
          confidence_score?: number | null
          created_at?: string
          detected_at?: string
          driver_name?: string | null
          id?: string
          license_plate: string
          location: string
          status?: string
          updated_at?: string
          vehicle_type: string
        }
        Update: {
          camera_id?: string | null
          confidence_score?: number | null
          created_at?: string
          detected_at?: string
          driver_name?: string | null
          id?: string
          license_plate?: string
          location?: string
          status?: string
          updated_at?: string
          vehicle_type?: string
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

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
