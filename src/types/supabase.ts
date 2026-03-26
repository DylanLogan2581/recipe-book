export type Json =
  | boolean
  | null
  | number
  | string
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      recipe_equipment: {
        Row: {
          created_at: string;
          details: string | null;
          id: string;
          is_optional: boolean;
          name: string;
          position: number;
          recipe_id: string;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          details?: string | null;
          id?: string;
          is_optional?: boolean;
          name: string;
          position: number;
          recipe_id: string;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          details?: string | null;
          id?: string;
          is_optional?: boolean;
          name?: string;
          position?: number;
          recipe_id?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            columns: ["recipe_id"];
            foreignKeyName: "recipe_equipment_recipe_id_fkey";
            isOneToOne: false;
            referencedColumns: ["id"];
            referencedRelation: "recipes";
          },
        ];
      };
      recipe_ingredients: {
        Row: {
          amount: number | null;
          created_at: string;
          id: string;
          is_optional: boolean;
          item: string;
          notes: string | null;
          position: number;
          preparation: string | null;
          recipe_id: string;
          unit: string | null;
          updated_at: string;
        };
        Insert: {
          amount?: number | null;
          created_at?: string;
          id?: string;
          is_optional?: boolean;
          item: string;
          notes?: string | null;
          position: number;
          preparation?: string | null;
          recipe_id: string;
          unit?: string | null;
          updated_at?: string;
        };
        Update: {
          amount?: number | null;
          created_at?: string;
          id?: string;
          is_optional?: boolean;
          item?: string;
          notes?: string | null;
          position?: number;
          preparation?: string | null;
          recipe_id?: string;
          unit?: string | null;
          updated_at?: string;
        };
        Relationships: [
          {
            columns: ["recipe_id"];
            foreignKeyName: "recipe_ingredients_recipe_id_fkey";
            isOneToOne: false;
            referencedColumns: ["id"];
            referencedRelation: "recipes";
          },
        ];
      };
      recipe_steps: {
        Row: {
          created_at: string;
          id: string;
          instruction: string;
          notes: string | null;
          position: number;
          recipe_id: string;
          timer_seconds: number | null;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          instruction: string;
          notes?: string | null;
          position: number;
          recipe_id: string;
          timer_seconds?: number | null;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          instruction?: string;
          notes?: string | null;
          position?: number;
          recipe_id?: string;
          timer_seconds?: number | null;
          updated_at?: string;
        };
        Relationships: [
          {
            columns: ["recipe_id"];
            foreignKeyName: "recipe_steps_recipe_id_fkey";
            isOneToOne: false;
            referencedColumns: ["id"];
            referencedRelation: "recipes";
          },
        ];
      };
      recipes: {
        Row: {
          cook_minutes: number | null;
          cover_image_path: string | null;
          created_at: string;
          description: string;
          id: string;
          is_scalable: boolean;
          owner_id: string;
          prep_minutes: number | null;
          summary: string;
          title: string;
          updated_at: string;
          yield_quantity: number | null;
          yield_unit: string | null;
        };
        Insert: {
          cook_minutes?: number | null;
          cover_image_path?: string | null;
          created_at?: string;
          description?: string;
          id?: string;
          is_scalable?: boolean;
          owner_id?: string;
          prep_minutes?: number | null;
          summary?: string;
          title: string;
          updated_at?: string;
          yield_quantity?: number | null;
          yield_unit?: string | null;
        };
        Update: {
          cook_minutes?: number | null;
          cover_image_path?: string | null;
          created_at?: string;
          description?: string;
          id?: string;
          is_scalable?: boolean;
          owner_id?: string;
          prep_minutes?: number | null;
          summary?: string;
          title?: string;
          updated_at?: string;
          yield_quantity?: number | null;
          yield_unit?: string | null;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
  };
};
