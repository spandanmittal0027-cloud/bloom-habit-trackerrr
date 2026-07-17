// These types mirror supabase/schema.sql by hand so the project type-checks
// without needing the Supabase CLI. Once your project is linked, you can
// regenerate exact types with:
//
//   npx supabase gen types typescript --project-id <your-project-id> > src/lib/supabase/types.ts

export type Theme =
  | "pink-gingham"
  | "matcha-cafe"
  | "lavender-dream"
  | "blue-sky"
  | "sage-garden";

export type InteractionType =
  | "checkbox"
  | "water"
  | "steps"
  | "moon"
  | "pills"
  | "palette"
  | "leaf"
  | "stamp"
  | "phone"
  | "jar";

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          name: string | null;
          username: string | null;
          avatar_url: string | null;
          birthday: string | null;
          daily_goal: string | null;
          preferred_theme: Theme;
          dark_mode: boolean;
          timezone: string;
          reminder_settings: Record<string, unknown>;
          onboarding_complete: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["profiles"]["Row"]> & {
          id: string;
        };
        Update: Partial<Database["public"]["Tables"]["profiles"]["Row"]>;
        Relationships: [];
      };
      habits: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          emoji: string;
          color: string;
          interaction_type: InteractionType;
          target_value: number | null;
          unit: string | null;
          sort_order: number;
          is_custom: boolean;
          archived: boolean;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["habits"]["Row"]> & {
          user_id: string;
          name: string;
        };
        Update: Partial<Database["public"]["Tables"]["habits"]["Row"]>;
        Relationships: [];
      };
      habit_logs: {
        Row: {
          id: string;
          user_id: string;
          habit_id: string;
          log_date: string;
          completed: boolean;
          value: number;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["habit_logs"]["Row"]> & {
          user_id: string;
          habit_id: string;
          log_date: string;
        };
        Update: Partial<Database["public"]["Tables"]["habit_logs"]["Row"]>;
        Relationships: [];
      };
      journal_entries: {
        Row: {
          id: string;
          user_id: string;
          entry_date: string;
          content: string | null;
          mood: string | null;
          energy: number | null;
          stress: number | null;
          gratitude: string | null;
          win: string | null;
          tomorrow_goal: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<
          Database["public"]["Tables"]["journal_entries"]["Row"]
        > & {
          user_id: string;
          entry_date: string;
        };
        Update: Partial<Database["public"]["Tables"]["journal_entries"]["Row"]>;
        Relationships: [];
      };
      achievements: {
        Row: {
          id: string;
          user_id: string;
          type: string;
          habit_id: string | null;
          unlocked_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["achievements"]["Row"]> & {
          user_id: string;
          type: string;
        };
        Update: Partial<Database["public"]["Tables"]["achievements"]["Row"]>;
        Relationships: [];
      };
      vision_board_items: {
        Row: {
          id: string;
          user_id: string;
          image_url: string | null;
          caption: string | null;
          position: number;
          created_at: string;
        };
        Insert: Partial<
          Database["public"]["Tables"]["vision_board_items"]["Row"]
        > & { user_id: string };
        Update: Partial<
          Database["public"]["Tables"]["vision_board_items"]["Row"]
        >;
        Relationships: [];
      };
      bucket_list_items: {
        Row: {
          id: string;
          user_id: string;
          content: string;
          done: boolean;
          created_at: string;
        };
        Insert: Partial<
          Database["public"]["Tables"]["bucket_list_items"]["Row"]
        > & { user_id: string; content: string };
        Update: Partial<
          Database["public"]["Tables"]["bucket_list_items"]["Row"]
        >;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: {
      seed_default_habits: {
        Args: { p_user_id: string };
        Returns: void;
      };
      handle_new_user: {
        Args: Record<string, never>;
        Returns: unknown;
      };
    };
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
