alter table public.negotiation_sessions add column if not exists user_id uuid;

update public.negotiation_sessions ns
set user_id = np.user_id
from public.negotiation_plans np
where ns.user_id is null
  and ns.negotiation_plan_id = np.id;

alter table public.negotiation_sessions
  add constraint negotiation_sessions_user_id_fkey
  foreign key (user_id)
  references auth.users(id)
  on delete cascade;

create index if not exists negotiation_sessions_user_id_idx
  on public.negotiation_sessions(user_id);

create or replace function public.set_negotiation_session_user_id()
returns trigger as $$
begin
  if new.user_id is null then
    select user_id into new.user_id
    from public.negotiation_plans
    where id = new.negotiation_plan_id;
  end if;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists set_negotiation_session_user_id on public.negotiation_sessions;
create trigger set_negotiation_session_user_id
before insert or update of negotiation_plan_id
on public.negotiation_sessions
for each row
execute function public.set_negotiation_session_user_id();

alter table public.negotiation_sessions
  alter column user_id set not null;
