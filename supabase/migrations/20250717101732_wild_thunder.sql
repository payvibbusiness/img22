/*
  # Create user profiles table and authentication trigger

  1. New Tables
    - `user_profiles`
      - `id` (uuid, primary key, references auth.users)
      - `email` (text, unique)
      - `full_name` (text, nullable)
      - `subscription_type` (text, default 'free')
      - `scans_used` (integer, default 0)
      - `max_scans` (integer, default 1)
      - `is_admin` (boolean, default false)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `user_profiles` table
    - Add policies for users to read/update their own data
    - Add policy for admins to read all profiles

  3. Functions
    - `handle_new_user()` - Automatically creates user profile on signup
    - `can_user_scan()` - Checks if user can perform a scan
    - `increment_scan_count()` - Increments user's scan count

  4. Triggers
    - Auto-create user profile when new user signs up
*/

-- Create user_profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  full_name text,
  subscription_type text DEFAULT 'free' NOT NULL CHECK (subscription_type IN ('free', 'premium')),
  scans_used integer DEFAULT 0 NOT NULL,
  max_scans integer DEFAULT 1 NOT NULL,
  is_admin boolean DEFAULT false NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- Enable RLS
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can read own profile"
  ON user_profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON user_profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Admins can read all profiles"
  ON user_profiles
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND is_admin = true
    )
  );

-- Function to handle new user creation
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to automatically create user profile
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Function to check if user can scan
CREATE OR REPLACE FUNCTION can_user_scan(user_uuid uuid)
RETURNS boolean AS $$
DECLARE
  user_scans integer;
  user_max_scans integer;
BEGIN
  SELECT scans_used, max_scans
  INTO user_scans, user_max_scans
  FROM user_profiles
  WHERE id = user_uuid;
  
  IF NOT FOUND THEN
    RETURN false;
  END IF;
  
  RETURN user_scans < user_max_scans;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to increment scan count
CREATE OR REPLACE FUNCTION increment_scan_count(user_uuid uuid)
RETURNS void AS $$
BEGIN
  UPDATE user_profiles
  SET scans_used = scans_used + 1,
      updated_at = now()
  WHERE id = user_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;