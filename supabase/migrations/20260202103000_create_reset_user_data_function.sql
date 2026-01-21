create or replace function public.reset_user_data()
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  uid uuid;
begin
  uid := auth.uid();
  if uid is null then
    raise exception 'not authenticated';
  end if;

  delete from plan_checkpoints where plan_id in (select id from plans where user_id = uid);
  delete from plan_debt_priorities where plan_id in (select id from plans where user_id = uid)
    or debt_id in (select id from debts where user_id = uid);
  delete from plan_essentials where plan_id in (select id from plans where user_id = uid);
  delete from plan_levers where plan_id in (select id from plans where user_id = uid);

  delete from negotiation_sessions where negotiation_plan_id in (select id from negotiation_plans where user_id = uid);

  delete from agreements where user_id = uid;
  delete from negotiation_plans where user_id = uid;
  delete from negotiations where user_id = uid;

  delete from calendar_items where user_id = uid;
  delete from cuts where user_id = uid;
  delete from shadow_expenses where user_id = uid;
  delete from transactions where user_id = uid;
  delete from spending_rules where user_id = uid;
  delete from card_policy where user_id = uid;
  delete from monthly_budget where user_id = uid;
  delete from plan_306090 where user_id = uid;
  delete from weekly_ritual where user_id = uid;
  delete from financial_snapshot where user_id = uid;
  delete from variable_expenses where user_id = uid;
  delete from fixed_expenses where user_id = uid;
  delete from income_items where user_id = uid;
  delete from debts where user_id = uid;
  delete from decision_rules where user_id = uid;
  delete from emergency_fund where user_id = uid;
  delete from plans where user_id = uid;
  delete from progress_dashboard where user_id = uid;
  delete from achievements where user_id = uid;
  delete from daily_log where user_id = uid;
  delete from initial_assessment where user_id = uid;
  delete from user_commitment where user_id = uid;
  delete from user_profile where user_id = uid;
  delete from day_progress where user_id = uid;

  update profiles set xp_total = 0, level = 1 where id = uid;
end;
$$;

grant execute on function public.reset_user_data() to authenticated;
