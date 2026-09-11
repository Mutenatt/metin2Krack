-- Fase 0: Fundación de datos — Guía/Calculadora de Daño Metin2
-- Separa atributos base del ítem de sus bonos aleatorios (ver prompt.md).

-- ============================================================
-- Tablas de referencia (catálogo, solo lectura pública)
-- ============================================================

create table razas (
  id smallserial primary key,
  nombre text not null unique
);

create table tipos_slot (
  id smallserial primary key,
  codigo text not null unique, -- arma, armadura, casco, escudo, pulsera, pendientes, collar, zapatos, peinado, atuendo, skin_arma, estola, vestimenta_aura
  nombre text not null,
  categoria text not null check (categoria in ('equipamiento', 'atuendo'))
);

create table bonos_aleatorios (
  id serial primary key,
  nombre text not null, -- ej. "Resistencia a Media", "Daño de Media"
  tipo text not null,
  descripcion text
);

create table piedras_dragon (
  id smallserial primary key,
  nombre text not null unique -- Diamante, Rubí, Jade, Zafiro, Granate, Ónice
);

create table piedras_dragon_grados (
  id smallserial primary key,
  pureza text not null, -- Mítica
  grado text not null,  -- Clara, Impecable, Excelente
  unique (pureza, grado)
);

create table piedras_dragon_bonos (
  id serial primary key,
  piedra_id smallint not null references piedras_dragon(id),
  nombre text not null,
  valor_min numeric not null,
  valor_max numeric not null
);

create table mascota_habilidades (
  id serial primary key,
  nombre text not null unique, -- Berserker, Perforador, Vampirismo
  descripcion text
);

-- ============================================================
-- Ítems: atributos base separados de sus bonos aleatorios
-- ============================================================

create table items_base (
  id serial primary key,
  nombre text not null,
  tipo_slot_id smallint not null references tipos_slot(id),
  nivel_requerido int not null default 1,
  stats_base jsonb not null default '{}'::jsonb, -- varía por tipo de ítem (ataque, defensa, etc.)
  porcentaje_absorcion numeric -- solo aplica a Estola
);

-- catálogo: qué bonos aleatorios puede rolar cada ítem base, y en qué rango
create table item_bonos_disponibles (
  id serial primary key,
  item_base_id int not null references items_base(id) on delete cascade,
  bono_id int not null references bonos_aleatorios(id),
  valor_min numeric not null,
  valor_max numeric not null
);

-- ============================================================
-- Builds guardados por el usuario
-- ============================================================

create table builds (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  slug text not null unique,
  nombre text not null,
  es_publico boolean not null default false,
  raza_id smallint not null references razas(id),
  nivel int not null check (nivel >= 1), -- sin tope superior: servidores privados suelen superar 120
  nivel_campeon int not null default 0,
  vit int not null default 0,
  inteligencia int not null default 0, -- INT
  fuerza int not null default 0,       -- STR
  destreza int not null default 0,     -- DEX
  mascota_nivel int,
  mascota_dias_vida int,
  mascota_hp_pct numeric,
  mascota_def_pct numeric,
  mascota_sp_pct numeric,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index builds_user_id_idx on builds(user_id);

create table build_equipamiento (
  id serial primary key,
  build_id uuid not null references builds(id) on delete cascade,
  tipo_slot_id smallint not null references tipos_slot(id),
  item_base_id int references items_base(id),
  bono_id int references bonos_aleatorios(id),
  bono_valor numeric,
  unique (build_id, tipo_slot_id)
);

create table build_piedras (
  id serial primary key,
  build_id uuid not null references builds(id) on delete cascade,
  piedra_id smallint not null references piedras_dragon(id),
  grado_id smallint not null references piedras_dragon_grados(id),
  bono_id int references piedras_dragon_bonos(id),
  unique (build_id, piedra_id)
);

create table build_mascota_habilidades (
  id serial primary key,
  build_id uuid not null references builds(id) on delete cascade,
  habilidad_id int not null references mascota_habilidades(id),
  slot_index smallint not null check (slot_index between 1 and 3),
  unique (build_id, slot_index)
);

-- ============================================================
-- updated_at automático
-- ============================================================

create function set_updated_at() returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger builds_set_updated_at
  before update on builds
  for each row execute function set_updated_at();

-- ============================================================
-- Límite de 10 builds por usuario (decidido en la etapa de auth)
-- ============================================================

create function check_limite_builds() returns trigger as $$
begin
  if (select count(*) from builds where user_id = new.user_id) >= 10 then
    raise exception 'Límite de 10 builds guardados alcanzado';
  end if;
  return new;
end;
$$ language plpgsql;

create trigger builds_check_limite
  before insert on builds
  for each row execute function check_limite_builds();

-- ============================================================
-- Row Level Security
-- ============================================================

alter table builds enable row level security;
alter table build_equipamiento enable row level security;
alter table build_piedras enable row level security;
alter table build_mascota_habilidades enable row level security;

create policy builds_select on builds
  for select using (user_id = auth.uid() or es_publico = true);
create policy builds_insert on builds
  for insert with check (user_id = auth.uid());
create policy builds_update on builds
  for update using (user_id = auth.uid());
create policy builds_delete on builds
  for delete using (user_id = auth.uid());

create policy build_equipamiento_select on build_equipamiento
  for select using (
    exists (select 1 from builds b where b.id = build_id and (b.user_id = auth.uid() or b.es_publico = true))
  );
create policy build_equipamiento_write on build_equipamiento
  for all using (
    exists (select 1 from builds b where b.id = build_id and b.user_id = auth.uid())
  );

create policy build_piedras_select on build_piedras
  for select using (
    exists (select 1 from builds b where b.id = build_id and (b.user_id = auth.uid() or b.es_publico = true))
  );
create policy build_piedras_write on build_piedras
  for all using (
    exists (select 1 from builds b where b.id = build_id and b.user_id = auth.uid())
  );

create policy build_mascota_habilidades_select on build_mascota_habilidades
  for select using (
    exists (select 1 from builds b where b.id = build_id and (b.user_id = auth.uid() or b.es_publico = true))
  );
create policy build_mascota_habilidades_write on build_mascota_habilidades
  for all using (
    exists (select 1 from builds b where b.id = build_id and b.user_id = auth.uid())
  );

-- Tablas de catálogo: lectura pública, sin escritura desde el cliente
alter table razas enable row level security;
alter table tipos_slot enable row level security;
alter table bonos_aleatorios enable row level security;
alter table piedras_dragon enable row level security;
alter table piedras_dragon_grados enable row level security;
alter table piedras_dragon_bonos enable row level security;
alter table mascota_habilidades enable row level security;
alter table items_base enable row level security;
alter table item_bonos_disponibles enable row level security;

create policy razas_select on razas for select using (true);
create policy tipos_slot_select on tipos_slot for select using (true);
create policy bonos_aleatorios_select on bonos_aleatorios for select using (true);
create policy piedras_dragon_select on piedras_dragon for select using (true);
create policy piedras_dragon_grados_select on piedras_dragon_grados for select using (true);
create policy piedras_dragon_bonos_select on piedras_dragon_bonos for select using (true);
create policy mascota_habilidades_select on mascota_habilidades for select using (true);
create policy items_base_select on items_base for select using (true);
create policy item_bonos_disponibles_select on item_bonos_disponibles for select using (true);
