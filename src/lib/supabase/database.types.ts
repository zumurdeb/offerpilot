// Hand-written to match supabase/migrations/0001_init.sql. Regenerate with
// `supabase gen types typescript` once the project is linked, if preferred.

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          full_name: string | null;
          email: string | null;
          created_at: string;
        };
        Insert: {
          id: string;
          full_name?: string | null;
          email?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          full_name?: string | null;
          email?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      promotions: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          promotion_type: string;
          product_name: string;
          selling_price: number;
          product_cost: number;
          discount_type: string;
          discount_value: number;
          shipping_cost: number;
          payment_fee_percentage: number;
          expected_quantity: number;
          profit_per_order: number;
          profit_margin: number;
          total_projected_profit: number;
          campaign_start_date: string | null;
          campaign_end_date: string | null;
          status: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          promotion_type: string;
          product_name: string;
          selling_price: number;
          product_cost?: number;
          discount_type: string;
          discount_value?: number;
          shipping_cost?: number;
          payment_fee_percentage?: number;
          expected_quantity?: number;
          profit_per_order?: number;
          profit_margin?: number;
          total_projected_profit?: number;
          campaign_start_date?: string | null;
          campaign_end_date?: string | null;
          status?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          promotion_type?: string;
          product_name?: string;
          selling_price?: number;
          product_cost?: number;
          discount_type?: string;
          discount_value?: number;
          shipping_cost?: number;
          payment_fee_percentage?: number;
          expected_quantity?: number;
          profit_per_order?: number;
          profit_margin?: number;
          total_projected_profit?: number;
          campaign_start_date?: string | null;
          campaign_end_date?: string | null;
          status?: string;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      comparisons: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          scenarios: unknown;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          scenarios: unknown;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          scenarios?: unknown;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      user_settings: {
        Row: {
          id: string;
          user_id: string;
          default_currency: string;
          default_shipping_cost: number;
          default_payment_fee: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          default_currency?: string;
          default_shipping_cost?: number;
          default_payment_fee?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          default_currency?: string;
          default_shipping_cost?: number;
          default_payment_fee?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
