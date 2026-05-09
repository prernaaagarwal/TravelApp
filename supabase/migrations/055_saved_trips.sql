-- Create saved_trips table for users to save their planned trips

CREATE TABLE IF NOT EXISTS saved_trips (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  destination TEXT NOT NULL,
  days INTEGER NOT NULL,
  budget INTEGER NOT NULL,
  month TEXT,
  notes TEXT,
  matched_itinerary_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for faster user queries
CREATE INDEX IF NOT EXISTS idx_saved_trips_user_id ON saved_trips(user_id);
CREATE INDEX IF NOT EXISTS idx_saved_trips_created_at ON saved_trips(created_at DESC);

-- RLS policies
ALTER TABLE saved_trips ENABLE ROW LEVEL SECURITY;

-- Users can only see their own saved trips
CREATE POLICY "Users can view own saved trips"
  ON saved_trips
  FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own saved trips
CREATE POLICY "Users can insert own saved trips"
  ON saved_trips
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own saved trips
CREATE POLICY "Users can update own saved trips"
  ON saved_trips
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Users can delete their own saved trips
CREATE POLICY "Users can delete own saved trips"
  ON saved_trips
  FOR DELETE
  USING (auth.uid() = user_id);

-- Update trigger for updated_at
CREATE OR REPLACE FUNCTION update_saved_trips_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER saved_trips_updated_at
  BEFORE UPDATE ON saved_trips
  FOR EACH ROW
  EXECUTE FUNCTION update_saved_trips_updated_at();
