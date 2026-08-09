create table if not exists referrals (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  referrer_name text not null,
  referrer_email text not null,
  referred_business text not null,
  referred_email text,
  status text not null default 'pending' check (status in ('pending', 'redeemed')),
  redeemed_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists referrals_code_idx on referrals (code);
