-- build_equipamiento ya guarda el valor rolado del bono (bono_valor);
-- build_piedras se había quedado sin el campo equivalente.
alter table build_piedras add column bono_valor numeric;
