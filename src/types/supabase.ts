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
      profiles: {
        Row: {
          avatar_path: string | null;
          bio: string | null;
          created_at: string;
          display_name: string;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          avatar_path?: string | null;
          bio?: string | null;
          created_at?: string;
          display_name: string;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          avatar_path?: string | null;
          bio?: string | null;
          created_at?: string;
          display_name?: string;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      recipe_cook_logs: {
        Row: {
          cooked_on: string;
          created_at: string;
          id: string;
          notes: string | null;
          owner_id: string;
          photo_path: string | null;
          recipe_id: string;
          updated_at: string;
        };
        Insert: {
          cooked_on?: string;
          created_at?: string;
          id?: string;
          notes?: string | null;
          owner_id?: string;
          photo_path?: string | null;
          recipe_id: string;
          updated_at?: string;
        };
        Update: {
          cooked_on?: string;
          created_at?: string;
          id?: string;
          notes?: string | null;
          owner_id?: string;
          photo_path?: string | null;
          recipe_id?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            columns: ["recipe_id"];
            foreignKeyName: "recipe_cook_logs_recipe_id_fkey";
            isOneToOne: false;
            referencedColumns: ["id"];
            referencedRelation: "recipes";
          },
        ];
      };
      recipe_categories: {
        Row: {
          created_at: string;
          id: string;
          is_active: boolean;
          name: string;
          slug: string;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          is_active?: boolean;
          name: string;
          slug: string;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          is_active?: boolean;
          name?: string;
          slug?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      recipe_category_assignments: {
        Row: {
          category_id: string;
          created_at: string;
          recipe_id: string;
        };
        Insert: {
          category_id: string;
          created_at?: string;
          recipe_id: string;
        };
        Update: {
          category_id?: string;
          created_at?: string;
          recipe_id?: string;
        };
        Relationships: [
          {
            columns: ["category_id"];
            foreignKeyName: "recipe_category_assignments_category_id_fkey";
            isOneToOne: false;
            referencedColumns: ["id"];
            referencedRelation: "recipe_categories";
          },
          {
            columns: ["recipe_id"];
            foreignKeyName: "recipe_category_assignments_recipe_id_fkey";
            isOneToOne: false;
            referencedColumns: ["id"];
            referencedRelation: "recipes";
          },
        ];
      };
      recipe_equipment: {
        Row: {
          created_at: string;
          details: string | null;
          equipment_id: string;
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
          equipment_id: string;
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
          equipment_id?: string;
          id?: string;
          is_optional?: boolean;
          name?: string;
          position?: number;
          recipe_id?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            columns: ["equipment_id"];
            foreignKeyName: "recipe_equipment_equipment_id_fkey";
            isOneToOne: false;
            referencedColumns: ["id"];
            referencedRelation: "user_equipment";
          },
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
          allergens: string[];
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
          allergens?: string[];
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
          allergens?: string[];
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
      user_equipment: {
        Row: {
          created_at: string;
          id: string;
          name: string;
          owner_id: string;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          name: string;
          owner_id?: string;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          name?: string;
          owner_id?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      user_roles: {
        Row: {
          created_at: string;
          role: string;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          role: string;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          created_at?: string;
          role?: string;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: {
      current_user_is_admin: {
        Args: Record<PropertyKey, never>;
        Returns: boolean;
      };
    };
  };
};
