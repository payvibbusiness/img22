/*
  # Create API keys table for admin management

  1. New Tables
    - `api_keys`
      - `id` (uuid, primary key)
      - `service_name` (text)
      - `api_key` (text, encrypted)
      - `is_active` (boolean, default true)
      - `created_by` (uuid, references user_profiles)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `api_keys` table
    - Add policy for admins to manage API keys
*/

-- Create api_keys table
CREATE TABLE IF NOT EXISTS api_keys (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  service_name text NOT NULL,
  api_key text NOT NULL,
  is_active boolean DEFAULT true NOT NULL,
  created_by uuid REFERENCES user_profiles(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- Enable RLS
ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY;

-- RLS Policies - Only admins can manage API keys
CREATE POLICY "Admins can manage API keys"
  ON api_keys
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND is_admin = true
    )
  );