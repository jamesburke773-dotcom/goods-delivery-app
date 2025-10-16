CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  role VARCHAR(16) NOT NULL CHECK (role IN ('customer','courier','admin','merchant')),
  name TEXT,
  email TEXT UNIQUE,
  phone TEXT,
  password_hash TEXT,
  kyc_doc_url TEXT,
  is_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id uuid REFERENCES users(id) ON DELETE SET NULL,
  courier_id uuid REFERENCES users(id) ON DELETE SET NULL,
  pickup_address TEXT,
  pickup_lat DOUBLE PRECISION,
  pickup_lng DOUBLE PRECISION,
  dropoff_address TEXT,
  dropoff_lat DOUBLE PRECISION,
  dropoff_lng DOUBLE PRECISION,
  status VARCHAR(32) NOT NULL DEFAULT 'created',
  price_cents INTEGER,
  tip_cents INTEGER DEFAULT 0,
  payment_status VARCHAR(32) DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE INDEX idx_orders_status ON orders (status);
CREATE INDEX idx_orders_customer ON orders (customer_id);
CREATE INDEX idx_orders_courier ON orders (courier_id);

CREATE TABLE courier_locations (
  courier_id uuid PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  lat DOUBLE PRECISION,
  lng DOUBLE PRECISION,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE ratings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid REFERENCES orders(id) ON DELETE CASCADE,
  from_user uuid REFERENCES users(id),
  to_user uuid REFERENCES users(id),
  score INTEGER CHECK (score >=1 AND score <=5),
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
