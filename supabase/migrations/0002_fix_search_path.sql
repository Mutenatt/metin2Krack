-- Corrige search_path mutable detectado por los security advisors de Supabase

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace function public.check_limite_builds()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if (select count(*) from public.builds where user_id = new.user_id) >= 10 then
    raise exception 'Límite de 10 builds guardados alcanzado';
  end if;
  return new;
end;
$$;
