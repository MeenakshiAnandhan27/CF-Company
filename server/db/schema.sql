-- Classic Fashions Database Schema

-- 1. Categories Table
CREATE TABLE IF NOT EXISTS categories (
  id VARCHAR(64) PRIMARY KEY,
  name VARCHAR(128) NOT NULL,
  tagline VARCHAR(255),
  description TEXT,
  subcategories TEXT,
  pattern_type VARCHAR(128),
  image TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Products Table
CREATE TABLE IF NOT EXISTS products (
  id VARCHAR(64) PRIMARY KEY,
  product_code VARCHAR(64) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  category_id VARCHAR(64) REFERENCES categories(id) ON DELETE SET NULL,
  category_label VARCHAR(128),
  subcategory VARCHAR(128),
  fabric_weave_type VARCHAR(64),
  quality VARCHAR(128),
  yarn_construction VARCHAR(128),
  width VARCHAR(64),
  gsm VARCHAR(64),
  weave VARCHAR(64),
  selvage VARCHAR(64),
  standard VARCHAR(64),
  loom VARCHAR(64),
  description TEXT,
  short_description TEXT,
  full_description TEXT,
  images TEXT,
  image_alt VARCHAR(255),
  colours TEXT,
  sizes TEXT,
  fabric VARCHAR(128),
  price VARCHAR(64),
  availability VARCHAR(64),
  active BOOLEAN DEFAULT TRUE,
  pattern_type VARCHAR(128),
  specifications TEXT,
  applications TEXT,
  customization_note TEXT,
  enquiry_enabled BOOLEAN DEFAULT TRUE,
  is_service BOOLEAN DEFAULT FALSE,
  featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Admin Users Table
CREATE TABLE IF NOT EXISTS admin_users (
  id VARCHAR(64) PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  role VARCHAR(64) DEFAULT 'admin',
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  last_login_at TIMESTAMP WITH TIME ZONE
);

-- 4. Customer Enquiries Table
CREATE TABLE IF NOT EXISTS customer_enquiries (
  id VARCHAR(64) PRIMARY KEY,
  reference_code VARCHAR(64) UNIQUE NOT NULL,
  enquiry_type VARCHAR(64) NOT NULL,
  customer_name VARCHAR(255) NOT NULL,
  company_name VARCHAR(255),
  phone VARCHAR(64) NOT NULL,
  email VARCHAR(255),
  city_state VARCHAR(255),
  preferred_contact_method VARCHAR(64),
  urgency VARCHAR(64),
  target_date VARCHAR(64),
  message TEXT,
  material_specs TEXT,
  reference_images TEXT,
  status VARCHAR(64) DEFAULT 'received',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. Enquiry Items Table
CREATE TABLE IF NOT EXISTS enquiry_items (
  id VARCHAR(64) PRIMARY KEY,
  enquiry_id VARCHAR(64) NOT NULL REFERENCES customer_enquiries(id) ON DELETE CASCADE,
  product_id VARCHAR(64),
  product_code VARCHAR(64),
  product_name VARCHAR(255),
  quantity VARCHAR(64),
  unit VARCHAR(64),
  selected_colour VARCHAR(128),
  selected_size VARCHAR(128),
  custom_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_code ON products(product_code);
CREATE INDEX IF NOT EXISTS idx_enquiries_status ON customer_enquiries(status);
CREATE INDEX IF NOT EXISTS idx_enquiries_code ON customer_enquiries(reference_code);
CREATE INDEX IF NOT EXISTS idx_enquiry_items_enquiry ON enquiry_items(enquiry_id);
