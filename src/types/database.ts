// Database types - Generated from Supabase schema

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      properties: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          title: string
          slug: string
          description: string
          location: string
          property_type: string
          price_per_night: number
          currency: string
          max_guests: number
          bedrooms: number | null
          bathrooms: number | null
          featured_image_url: string | null
          images: Json | null
          meta_title: string | null
          meta_description: string | null
          is_active: boolean
          is_featured: boolean
          amenities: Json | null
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          title: string
          slug: string
          description: string
          location: string
          property_type: string
          price_per_night: number
          currency?: string
          max_guests: number
          bedrooms?: number | null
          bathrooms?: number | null
          featured_image_url?: string | null
          images?: Json | null
          meta_title?: string | null
          meta_description?: string | null
          is_active?: boolean
          is_featured?: boolean
          amenities?: Json | null
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          title?: string
          slug?: string
          description?: string
          location?: string
          property_type?: string
          price_per_night?: number
          currency?: string
          max_guests?: number
          bedrooms?: number | null
          bathrooms?: number | null
          featured_image_url?: string | null
          images?: Json | null
          meta_title?: string | null
          meta_description?: string | null
          is_active?: boolean
          is_featured?: boolean
          amenities?: Json | null
        }
      }
      blocked_dates: {
        Row: {
          id: string
          property_id: string
          start_date: string
          end_date: string
          reason: string | null
          notes: string | null
          created_at: string
          created_by: string | null
        }
        Insert: {
          id?: string
          property_id: string
          start_date: string
          end_date: string
          reason?: string | null
          notes?: string | null
          created_at?: string
          created_by?: string | null
        }
        Update: {
          id?: string
          property_id?: string
          start_date?: string
          end_date?: string
          reason?: string | null
          notes?: string | null
          created_at?: string
          created_by?: string | null
        }
      }
      inquiries: {
        Row: {
          id: string
          created_at: string
          property_id: string
          full_name: string
          email: string | null
          phone: string | null
          check_in: string
          check_out: string
          guests: number
          status: string
          notes: string | null
          contacted_at: string | null
          whatsapp_sent: boolean
        }
        Insert: {
          id?: string
          created_at?: string
          property_id: string
          full_name: string
          email?: string | null
          phone?: string | null
          check_in: string
          check_out: string
          guests: number
          status?: string
          notes?: string | null
          contacted_at?: string | null
          whatsapp_sent?: boolean
        }
        Update: {
          id?: string
          created_at?: string
          property_id?: string
          full_name?: string
          email?: string | null
          phone?: string | null
          check_in?: string
          check_out?: string
          guests?: number
          status?: string
          notes?: string | null
          contacted_at?: string | null
          whatsapp_sent?: boolean
        }
      }
      contacts: {
        Row: {
          id: string
          created_at: string
          first_name: string
          last_name: string
          email: string
          phone: string | null
          message: string | null
          form_type: string | null
          property_id: string | null
          status: string
          notes: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          first_name: string
          last_name: string
          email: string
          phone?: string | null
          message?: string | null
          form_type?: string | null
          property_id?: string | null
          status?: string
          notes?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          first_name?: string
          last_name?: string
          email?: string
          phone?: string | null
          message?: string | null
          form_type?: string | null
          property_id?: string | null
          status?: string
          notes?: string | null
        }
      }
    }
  }
}
