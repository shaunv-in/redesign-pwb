-- Run this once in the Supabase SQL editor (Project > SQL Editor > New query).
-- Sets up the table + storage bucket + RLS policies for the
-- 300 Centre Street rental application form and admin page.

-- 1. Table -------------------------------------------------------------
create table if not exists public.rental_applications (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  application_number text,
  status text not null default 'New',

  -- Property (prefilled by the app; rent left blank for applicant)
  property_address text not null default '300 Centre Street',
  unit text not null default '605',
  monthly_rent numeric,
  desired_move_in_date date,

  -- Applicant
  full_name text not null,
  date_of_birth date,
  phone text,
  email text,

  -- Current residence
  current_address text,
  current_city text,
  current_province text,
  current_postal_code text,
  length_at_current_address text,
  reason_for_leaving text,
  landlord_name text,
  landlord_phone text,

  -- Employment & income
  employer_name text,
  job_title text,
  employer_phone text,
  employment_length text,
  monthly_income numeric,
  additional_income_source text,
  additional_income_amount numeric,

  -- Household
  occupants text,
  has_pets boolean default false,
  pet_details text,
  vehicle_info text,

  -- Emergency contact
  emergency_contact_name text,
  emergency_contact_relationship text,
  emergency_contact_phone text,
  emergency_contact_email text,

  -- Uploaded documents (storage object paths, not public URLs)
  photo_id_path text,
  income_doc_paths text[],

  -- Consent / signature
  consent_soft_credit_check boolean not null default false,
  consent_photo_id_required boolean not null default false,
  consent_income_docs_required boolean not null default false,
  signature_full_name text,
  signed_at timestamptz,

  -- Admin-only fields (not visible/writable by applicants)
  admin_notes text,
  admin_attachment_paths text[],
  deleted_at timestamptz
);

-- If the table already existed before these columns were added, this backfills them.
alter table public.rental_applications add column if not exists application_number text;
alter table public.rental_applications add column if not exists status text not null default 'New';
alter table public.rental_applications add column if not exists admin_notes text;
alter table public.rental_applications add column if not exists admin_attachment_paths text[];
alter table public.rental_applications add column if not exists deleted_at timestamptz;

alter table public.rental_applications enable row level security;

-- Anyone (including anonymous applicants) can submit a new application.
drop policy if exists "public can insert applications" on public.rental_applications;
create policy "public can insert applications"
  on public.rental_applications
  for insert
  to anon
  with check (true);

-- Only signed-in admins (you) can read submitted applications.
drop policy if exists "authenticated can read applications" on public.rental_applications;
create policy "authenticated can read applications"
  on public.rental_applications
  for select
  to authenticated
  using (true);

-- Only signed-in admins (you) can update an application's stage/status.
drop policy if exists "authenticated can update applications" on public.rental_applications;
create policy "authenticated can update applications"
  on public.rental_applications
  for update
  to authenticated
  using (true)
  with check (true);

-- Only signed-in admins (you) can permanently delete an application
-- (soft-delete uses the update policy above to set deleted_at instead).
drop policy if exists "authenticated can delete applications" on public.rental_applications;
create policy "authenticated can delete applications"
  on public.rental_applications
  for delete
  to authenticated
  using (true);

-- 2. Storage bucket for uploaded ID / income documents ------------------
insert into storage.buckets (id, name, public)
values ('rental-application-documents', 'rental-application-documents', false)
on conflict (id) do nothing;

-- Anyone can upload (applicants are anonymous), but only into this bucket.
drop policy if exists "public can upload rental documents" on storage.objects;
create policy "public can upload rental documents"
  on storage.objects
  for insert
  to anon
  with check (bucket_id = 'rental-application-documents');

-- Signed-in admins can also upload (e.g. attaching a document a tenant sent by email).
drop policy if exists "authenticated can upload rental documents" on storage.objects;
create policy "authenticated can upload rental documents"
  on storage.objects
  for insert
  to authenticated
  with check (bucket_id = 'rental-application-documents');

-- Only signed-in admins (you) can read/download uploaded documents.
drop policy if exists "authenticated can read rental documents" on storage.objects;
create policy "authenticated can read rental documents"
  on storage.objects
  for select
  to authenticated
  using (bucket_id = 'rental-application-documents');

-- 3. Admin user -----------------------------------------------------------
-- Create your own login in the Supabase dashboard:
-- Authentication > Users > Add user (email + password).
-- That account is what you'll use to sign in on the /admin page.
