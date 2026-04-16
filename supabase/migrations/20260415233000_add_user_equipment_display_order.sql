alter table public.user_equipment
add column display_order integer;

with
  ordered_equipment as (
    select
      id,
      row_number() over (
        partition by
          owner_id
        order by
          lower(btrim(name)),
          created_at,
          id
      ) as next_display_order
    from
      public.user_equipment
  )
update public.user_equipment
set
  display_order = ordered_equipment.next_display_order
from
  ordered_equipment
where
  ordered_equipment.id = user_equipment.id;

alter table public.user_equipment
alter column display_order
set not null;

alter table public.user_equipment
add constraint user_equipment_display_order_positive check (display_order >= 1);

create index user_equipment_owner_display_order_idx on public.user_equipment (owner_id, display_order, name);

create or replace function public.set_user_equipment_display_order () returns trigger language plpgsql
set
  search_path = public as $$
begin
  if new.display_order is null then
    select
      coalesce(max(display_order), 0) + 1
    into
      new.display_order
    from
      public.user_equipment
    where
      owner_id = new.owner_id;
  end if;

  return new;
end;
$$;

create trigger set_user_equipment_display_order before insert on public.user_equipment for each row
execute function public.set_user_equipment_display_order ();
