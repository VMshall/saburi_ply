-- Saburi Ply — form submission tables (Supabase / Postgres)
-- Mirrors the legacy Sequelize models (server/src/models/*). Run once against the project.
-- RLS is enabled with NO policies: only the service/secret key (used server-side by the
-- Next.js API route) can read/write. The anon/public key has no access.

-- Request a Quote (HomeContactForm) -> /api/forms/quote
create table if not exists public.quotes (
  id                       bigint generated always as identity primary key,
  name                     text not null,
  email                    text,
  phone_number             text not null,
  company_name             text,
  inquiry_type             text not null,
  product_type             text,
  estimated_qty            text,
  additional_requirements  text,
  created_at               timestamptz not null default now()
);

-- Contact form -> /api/forms/contact-us
create table if not exists public.contact_us (
  id            bigint generated always as identity primary key,
  name          text not null,
  email         text not null,
  phone_number  text not null,
  state         text not null,
  message       text not null,
  created_at    timestamptz not null default now()
);

-- Product enquiry -> /api/forms/enquiry
create table if not exists public.enquiries (
  id            bigint generated always as identity primary key,
  name          text not null,
  email         text,
  phone_number  text not null,
  state         text not null,
  city          text,
  product       text not null,
  message       text,
  created_at    timestamptz not null default now()
);

-- Become a partner (dealership / architect / interior designer) -> /api/forms/become-partner
create table if not exists public.become_partner (
  id              bigint generated always as identity primary key,
  name            text not null,
  firm_name       text not null,
  city            text not null,
  contact_number  text not null,
  email           text,
  project_type    text not null,
  message         text not null,
  partner_type    text not null check (partner_type in ('INTERIOR_DESIGNER','ARCHITECT','DEALERSHIP')),
  created_at      timestamptz not null default now()
);

-- Lightweight lead capture (QuoteModal step 1) -> /api/forms/save-data
create table if not exists public.save_data (
  id            bigint generated always as identity primary key,
  name          text not null,
  email         text,
  phone_number  text,
  created_at    timestamptz not null default now()
);

-- Newsletter subscribers (footer) -> /api/forms/subscribers
create table if not exists public.subscribers (
  id               bigint generated always as identity primary key,
  email            text not null unique,
  status           text not null default 'active' check (status in ('pending','active','unsubscribed','bounced')),
  unsubscribed_at  timestamptz,
  created_at       timestamptz not null default now()
);

-- Lock everything down to the server-side secret key only.
alter table public.quotes         enable row level security;
alter table public.contact_us     enable row level security;
alter table public.enquiries      enable row level security;
alter table public.become_partner enable row level security;
alter table public.save_data      enable row level security;
alter table public.subscribers    enable row level security;
