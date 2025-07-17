/*
  # Create scan logs table for tracking scan usage

  1. New Tables
    - `scan_logs`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references user_profiles)
      - `document_id` (uuid, references documents, nullable)
      - `success` (boolean)
      - `error_message` (text, nullable)
      - `processing_time` (integer, nullable)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on `scan_logs` table
    - Add policy for users to read their own scan logs
    - Add policy for admins to read all scan logs
*/

-- Create scan_logs table
CREATE TABLE IF NOT EXISTS scan_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  document_id uuid REFERENCES documents(id) ON DELETE SET NULL,
  success boolean NOT NULL,
  error_message text,
  processing_time integer,
  created_at timestamptz DEFAULT now() NOT NULL
);

-- Enable RLS
ALTER TABLE scan_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can read own scan logs"
  ON scan_logs
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert own scan logs"
  ON scan_logs
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Admins can read all scan logs"
  ON scan_logs
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND is_admin = true
    )
  );