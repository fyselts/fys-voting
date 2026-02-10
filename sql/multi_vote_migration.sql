-- 1. Add vote_quota to profiles
alter table public.profiles 
add column if not exists vote_quota int not null default 1;

-- 2. Recreate voters table to allow multiple votes per user
-- We need to drop the existing table and recreate it with a new structure
-- OLD: user_id (PK), voted_at
-- NEW: id (PK), user_id (FK), voted_at

drop table if exists public.voters;

create table public.voters (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  voted_at timestamptz default now()
);

-- 3. Enable RLS
alter table public.voters enable row level security;

-- 4. Policies for voters
-- Users can insert their own id (when voting)
create policy "Users can cast votes" on public.voters for insert with check (
  auth.uid() = user_id
);

-- Admins can delete voters (reset)
create policy "Admins can reset voters" on public.voters for delete using (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);

-- Everyone can read voters (to check if they voted - though with multi-vote this might need count)
-- Actually, for "votes left", we need to count how many times a user appears in this table.
create policy "Everyone can count voters" on public.voters for select using (true);
