-- Trigger: when a new user is confirmed (inserted into auth.users),
-- automatically assign their user_id to the subdomain reservation
-- stored in their user_metadata.reservation_id.

create or replace function public.handle_new_user_claim_reservation()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_reservation_id uuid;
begin
  v_reservation_id := (new.raw_user_meta_data->>'reservation_id')::uuid;

  if v_reservation_id is not null then
    update public.subdomain_reservations
    set user_id = new.id,
        updated_at = now()
    where id = v_reservation_id
      and status = 'reserved'
      and user_id is null;
  end if;

  return new;
end;
$$;

-- Fire after INSERT on auth.users (new registration)
drop trigger if exists on_auth_user_created_claim_reservation on auth.users;
create trigger on_auth_user_created_claim_reservation
  after insert on auth.users
  for each row
  execute procedure public.handle_new_user_claim_reservation();
