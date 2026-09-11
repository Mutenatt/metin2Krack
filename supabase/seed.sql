-- Datos de catálogo fijos (no cambian entre builds)

insert into razas (nombre) values
  ('Guerrero'), ('Sura'), ('Ninja'), ('Chamán');

insert into tipos_slot (codigo, nombre, categoria) values
  ('arma', 'Arma', 'equipamiento'),
  ('armadura', 'Armadura', 'equipamiento'),
  ('casco', 'Casco', 'equipamiento'),
  ('escudo', 'Escudo', 'equipamiento'),
  ('pulsera', 'Pulsera', 'equipamiento'),
  ('pendientes', 'Pendientes', 'equipamiento'),
  ('collar', 'Collar', 'equipamiento'),
  ('zapatos', 'Zapatos', 'equipamiento'),
  ('peinado', 'Peinado', 'atuendo'),
  ('atuendo', 'Atuendo', 'atuendo'),
  ('skin_arma', 'Skin de Arma', 'atuendo'),
  ('estola', 'Estola', 'atuendo'),
  ('vestimenta_aura', 'Vestimenta de Aura', 'atuendo');

insert into piedras_dragon (nombre) values
  ('Diamante'), ('Rubí'), ('Jade'), ('Zafiro'), ('Granate'), ('Ónice');

insert into piedras_dragon_grados (pureza, grado) values
  ('Mítica', 'Clara'),
  ('Mítica', 'Impecable'),
  ('Mítica', 'Excelente');

insert into mascota_habilidades (nombre, descripcion) values
  ('Berserker', null),
  ('Perforador', null),
  ('Vampirismo', null);

-- Ítems de ejemplo (Fase 2), para poder probar el buscador de equipamiento

insert into bonos_aleatorios (nombre, tipo, descripcion) values
  ('Ataque Añadido', 'ataque', null),
  ('Defensa Añadida', 'defensa', null),
  ('Resistencia a Media', 'resistencia', null),
  ('HP Añadido', 'hp', null),
  ('SP Añadido', 'sp', null);

insert into items_base (nombre, tipo_slot_id, nivel_requerido, stats_base, porcentaje_absorcion) values
  ('Espada Oxidada', (select id from tipos_slot where codigo = 'arma'), 1, '{"ataque_min": 10, "ataque_max": 18}', null),
  ('Espada del Dragón de Metin', (select id from tipos_slot where codigo = 'arma'), 45, '{"ataque_min": 120, "ataque_max": 180}', null),
  ('Armadura de Cuero Curtido', (select id from tipos_slot where codigo = 'armadura'), 1, '{"defensa": 8}', null),
  ('Armadura del Guardián de Metin', (select id from tipos_slot where codigo = 'armadura'), 45, '{"defensa": 90}', null),
  ('Casco de Bronce', (select id from tipos_slot where codigo = 'casco'), 5, '{"defensa": 5}', null),
  ('Escudo de Madera', (select id from tipos_slot where codigo = 'escudo'), 5, '{"defensa": 4}', null),
  ('Pulsera de Hueso', (select id from tipos_slot where codigo = 'pulsera'), 10, '{"defensa": 3}', null),
  ('Pendientes de Jade', (select id from tipos_slot where codigo = 'pendientes'), 10, '{"inteligencia": 2}', null),
  ('Collar del Viajero', (select id from tipos_slot where codigo = 'collar'), 10, '{"vit": 2}', null),
  ('Botas de Cuero', (select id from tipos_slot where codigo = 'zapatos'), 5, '{"velocidad": 2}', null),
  ('Peinado del Aprendiz', (select id from tipos_slot where codigo = 'peinado'), 1, '{}', null),
  ('Túnica de Iniciado', (select id from tipos_slot where codigo = 'atuendo'), 1, '{}', null),
  ('Filo Espectral', (select id from tipos_slot where codigo = 'skin_arma'), 1, '{}', null),
  ('Estola de Iniciado', (select id from tipos_slot where codigo = 'estola'), 1, '{}', 5.0),
  ('Aura Menor del Dragón', (select id from tipos_slot where codigo = 'vestimenta_aura'), 1, '{}', null);

-- Bonos de ejemplo por piedra dragón (Fase 3)

insert into piedras_dragon_bonos (piedra_id, nombre, valor_min, valor_max) values
  ((select id from piedras_dragon where nombre = 'Diamante'), 'Resistencia a Media', 1, 5),
  ((select id from piedras_dragon where nombre = 'Diamante'), 'Daño de Media', 1, 5),
  ((select id from piedras_dragon where nombre = 'Rubí'), 'Daño Crítico', 1, 5),
  ((select id from piedras_dragon where nombre = 'Rubí'), 'Resistencia a Crítico', 1, 5),
  ((select id from piedras_dragon where nombre = 'Jade'), 'HP Añadido', 10, 50),
  ((select id from piedras_dragon where nombre = 'Jade'), 'SP Añadido', 10, 50),
  ((select id from piedras_dragon where nombre = 'Zafiro'), 'Resistencia a Media', 1, 5),
  ((select id from piedras_dragon where nombre = 'Zafiro'), 'Velocidad de Ataque', 1, 3),
  ((select id from piedras_dragon where nombre = 'Granate'), 'Daño de Media', 1, 5),
  ((select id from piedras_dragon where nombre = 'Granate'), 'Defensa Añadida', 5, 20),
  ((select id from piedras_dragon where nombre = 'Ónice'), 'Resistencia a Media', 1, 5),
  ((select id from piedras_dragon where nombre = 'Ónice'), 'Daño de Media', 1, 5);

insert into item_bonos_disponibles (item_base_id, bono_id, valor_min, valor_max)
select
  (select id from items_base where nombre = 'Espada del Dragón de Metin'),
  (select id from bonos_aleatorios where nombre = 'Ataque Añadido'),
  1, 10
union all
select
  (select id from items_base where nombre = 'Espada del Dragón de Metin'),
  (select id from bonos_aleatorios where nombre = 'Resistencia a Media'),
  1, 5
union all
select
  (select id from items_base where nombre = 'Armadura del Guardián de Metin'),
  (select id from bonos_aleatorios where nombre = 'Defensa Añadida'),
  1, 10
union all
select
  (select id from items_base where nombre = 'Armadura del Guardián de Metin'),
  (select id from bonos_aleatorios where nombre = 'HP Añadido'),
  10, 50;
