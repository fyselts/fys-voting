-- 1. Create profiles table if it doesn't exist
create table if not exists public.profiles (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  full_name text,
  role text default 'user',
  created_at timestamptz default now(),
  last_login_at timestamptz
);

-- 2. Enable RLS on profiles
alter table public.profiles enable row level security;

-- 3. Create policies (permissive for now to match current behavior)
create policy "Public profiles are viewable by everyone"
  on profiles for select
  using ( true );

-- Policy to allow the service_role and postgres to manage everything (implicitly true, but explicit for some setups)
-- Note: Triggers run with security definer usually bypass this, but valid to have.

-- 4. Create the function to handle new user creation
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
declare
  existing_profile_id uuid;
begin
  -- Check if a profile already exists with this email
  select id into existing_profile_id from public.profiles where email = new.email;

  if existing_profile_id is not null then
    -- OPTIONAL: Sync the ID. This updates the existing profile's ID to match the Auth User ID.
    -- This ensures that your app uses a single ID for both Auth and Profile.
    -- WARNING: This changes the PK of profiles. If other tables reference profiles.id, this might fail or requires ON UPDATE CASCADE.
    update public.profiles 
    set 
        id = new.id, 
        full_name = coalesce(new.raw_user_meta_data->>'full_name', full_name),
        role = coalesce(new.raw_user_meta_data->>'role', role)
    where email = new.email;
  else
    -- Insert new profile
    insert into public.profiles (id, email, full_name, role)
    values (
      new.id,
      new.email,
      coalesce(new.raw_user_meta_data->>'full_name', ''),
      coalesce(new.raw_user_meta_data->>'role', 'user')
    );
  end if;
  return new;
end;
$$;

-- 5. Create or Replace the trigger
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
