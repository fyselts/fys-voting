-- Create a table for voting settings (singleton)
create table voting_settings (
  id int primary key default 1,
  title text not null default 'Voting',
  max_choices int not null default 1,
  is_active boolean not null default false,
  is_published boolean not null default false,
  constraint single_row check (id = 1)
);

-- Insert the initial row
insert into voting_settings (id, title, max_choices, is_active, is_published)
values (1, 'Voting', 1, false, false)
on conflict (id) do nothing;

-- Create a table for voting options
create table voting_options (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  vote_count int not null default 0,
  created_at timestamptz default now()
);

-- Create a table to track who has voted (to prevent double voting)
create table voters (
  user_id uuid primary key references auth.users(id) on delete cascade,
  voted_at timestamptz default now()
);

-- Enable RLS
alter table voting_settings enable row level security;
alter table voting_options enable row level security;
alter table voters enable row level security;

-- Policies
-- Everyone can read settings
create policy "Everyone can read settings" on voting_settings for select using (true);
-- Only admins can update settings
create policy "Admins can update settings" on voting_settings for update using (
  exists (select 1 from profiles where id = auth.uid() and role = 'admin')
);

-- Everyone can read options
create policy "Everyone can read options" on voting_options for select using (true);
-- Only admins can insert/update/delete options
create policy "Admins can manage options" on voting_options for all using (
  exists (select 1 from profiles where id = auth.uid() and role = 'admin')
);

-- Voters can insert their own id (when voting)
create policy "Users can mark themselves as voted" on voters for insert with check (
  auth.uid() = user_id
);
-- Admins can delete voters (reset)
create policy "Admins can reset voters" on voters for delete using (
  exists (select 1 from profiles where id = auth.uid() and role = 'admin')
);
-- Everyone can read voters (to check if they voted)
create policy "Everyone can read voters" on voters for select using (true);

-- Function to increment vote count atomically
create or replace function increment_vote(option_id uuid)
returns void
language plpgsql
security definer
as $$
begin
  update voting_options
  set vote_count = vote_count + 1
  where id = option_id;
end;
$$;
