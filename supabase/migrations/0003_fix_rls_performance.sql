-- Corrige performance advisors: auth.uid() re-evaluado por fila, políticas SELECT
-- duplicadas (el patrón "for all" solapaba con "_select"), y agrega índices a
-- foreign keys sin cobertura. También agrega WITH CHECK a builds_update, que
-- faltaba (permitía reasignar el user_id de un build ajeno).

drop policy builds_select on builds;
drop policy builds_insert on builds;
drop policy builds_update on builds;
drop policy builds_delete on builds;

create policy builds_select on builds
  for select
  using (user_id = (select auth.uid()) or es_publico = true);

create policy builds_insert on builds
  for insert
  with check (user_id = (select auth.uid()));

create policy builds_update on builds
  for update
  using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));

create policy builds_delete on builds
  for delete
  using (user_id = (select auth.uid()));

drop policy build_equipamiento_select on build_equipamiento;
drop policy build_equipamiento_write on build_equipamiento;

create policy build_equipamiento_select on build_equipamiento
  for select using (
    exists (select 1 from builds b where b.id = build_id and (b.user_id = (select auth.uid()) or b.es_publico = true))
  );
create policy build_equipamiento_insert on build_equipamiento
  for insert with check (
    exists (select 1 from builds b where b.id = build_id and b.user_id = (select auth.uid()))
  );
create policy build_equipamiento_update on build_equipamiento
  for update using (
    exists (select 1 from builds b where b.id = build_id and b.user_id = (select auth.uid()))
  ) with check (
    exists (select 1 from builds b where b.id = build_id and b.user_id = (select auth.uid()))
  );
create policy build_equipamiento_delete on build_equipamiento
  for delete using (
    exists (select 1 from builds b where b.id = build_id and b.user_id = (select auth.uid()))
  );

drop policy build_piedras_select on build_piedras;
drop policy build_piedras_write on build_piedras;

create policy build_piedras_select on build_piedras
  for select using (
    exists (select 1 from builds b where b.id = build_id and (b.user_id = (select auth.uid()) or b.es_publico = true))
  );
create policy build_piedras_insert on build_piedras
  for insert with check (
    exists (select 1 from builds b where b.id = build_id and b.user_id = (select auth.uid()))
  );
create policy build_piedras_update on build_piedras
  for update using (
    exists (select 1 from builds b where b.id = build_id and b.user_id = (select auth.uid()))
  ) with check (
    exists (select 1 from builds b where b.id = build_id and b.user_id = (select auth.uid()))
  );
create policy build_piedras_delete on build_piedras
  for delete using (
    exists (select 1 from builds b where b.id = build_id and b.user_id = (select auth.uid()))
  );

drop policy build_mascota_habilidades_select on build_mascota_habilidades;
drop policy build_mascota_habilidades_write on build_mascota_habilidades;

create policy build_mascota_habilidades_select on build_mascota_habilidades
  for select using (
    exists (select 1 from builds b where b.id = build_id and (b.user_id = (select auth.uid()) or b.es_publico = true))
  );
create policy build_mascota_habilidades_insert on build_mascota_habilidades
  for insert with check (
    exists (select 1 from builds b where b.id = build_id and b.user_id = (select auth.uid()))
  );
create policy build_mascota_habilidades_update on build_mascota_habilidades
  for update using (
    exists (select 1 from builds b where b.id = build_id and b.user_id = (select auth.uid()))
  ) with check (
    exists (select 1 from builds b where b.id = build_id and b.user_id = (select auth.uid()))
  );
create policy build_mascota_habilidades_delete on build_mascota_habilidades
  for delete using (
    exists (select 1 from builds b where b.id = build_id and b.user_id = (select auth.uid()))
  );

create index build_equipamiento_bono_id_idx on build_equipamiento(bono_id);
create index build_equipamiento_item_base_id_idx on build_equipamiento(item_base_id);
create index build_equipamiento_tipo_slot_id_idx on build_equipamiento(tipo_slot_id);
create index build_mascota_habilidades_habilidad_id_idx on build_mascota_habilidades(habilidad_id);
create index build_piedras_bono_id_idx on build_piedras(bono_id);
create index build_piedras_grado_id_idx on build_piedras(grado_id);
create index build_piedras_piedra_id_idx on build_piedras(piedra_id);
create index builds_raza_id_idx on builds(raza_id);
create index item_bonos_disponibles_bono_id_idx on item_bonos_disponibles(bono_id);
create index item_bonos_disponibles_item_base_id_idx on item_bonos_disponibles(item_base_id);
create index items_base_tipo_slot_id_idx on items_base(tipo_slot_id);
create index piedras_dragon_bonos_piedra_id_idx on piedras_dragon_bonos(piedra_id);
