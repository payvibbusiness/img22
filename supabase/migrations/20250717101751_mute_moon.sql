/*
  # Create documents table for storing scanned documents

  1. New Tables
    - `documents`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references user_profiles)
      - `title` (text)
      - `original_text` (text)
      - `image_url` (text, nullable)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `documents` table
    - Add policy for users to manage their own documents
    - Add policy for admins to read all documents
*/

-- Create documents table
CREATE TABLE IF NOT EXISTS documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  title text NOT NULL,
  original_text text NOT NULL,
  image_url text,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- Enable RLS
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can manage own documents"
  ON documents
  FOR ALL
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Admins can read all documents"
  ON documents
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND is_admin = true
    )
  );