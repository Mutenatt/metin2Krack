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
