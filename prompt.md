Actúa como un desarrollador Full-Stack Senior experto en interfaces de usuario (UI/UX) y arquitecturas de bases de datos. Tu objetivo es desarrollar una plataforma web interactiva y segura que funcionará como Guía y Calculadora de Daño (PvP/PvM) para el juego Metin2.



Stack Tecnológico Requerido:



Frontend: React (Next.js recomendado para SEO y rendimiento), TailwindCSS para el diseño responsivo, y Framer Motion para animaciones y transiciones fluidas.



Backend/Base de Datos: Supabase (PostgreSQL) para gestionar las APIs de los ítems, autenticación de usuarios (si desean guardar sus builds) y cálculos desde el servidor para evitar manipulaciones en el cliente.



Despliegue: Vercel.



Fases de Desarrollo (MVP incremental): No desarrolles todos los módulos a la vez. Seguí esta secuencia:

- Fase 0 — Fundación de datos: schema de Supabase (tabla de ítems base separada de sus bonos aleatorios, piedras dragón, mascotas, razas), sin UI todavía.

- Fase 1 — Panel de Estado del Personaje + motor de cálculo placeholder: raza, nivel, campeón, inputs VIT/INT/STR/DEX conectados a un calcularDaño() dummy. Este es el estado global (Zustand) que los demás módulos van a leer/escribir.

- Fase 2 — Módulo de Equipamiento + Atuendos: grid de slots + modal buscador contra Supabase. Valida el patrón de interacción slot → modal → selección que se reutiliza después.

- Fase 3 — Módulo de Alquimia (astrolabio) + Módulo de Mascotas: reutilizan el patrón de interacción de la Fase 2 en vez de inventarlo de cero.

- Fase 4 — Auth, builds guardados, comparación/export y pulido visual final (animaciones Framer Motion, sello de tinta del astrolabio) + deploy en Vercel.



Diseño Visual y UX — Dirección Visual Definitiva: "Grimorio de Alquimista":



Principio rector: el layout y la disposición espacial de la interfaz (silueta del personaje con sus slots, rueda de 6 ranuras de alquimia, panel lateral de stats, slots de mascota) deben imitar fielmente la interfaz del juego para que sea inmediatamente familiar y usable para cualquier jugador. La piel visual que envuelve esa estructura, en cambio, debe ser una dirección de diseño propia y novedosa, no un reskin literal del HUD del juego.



Paleta (tokens de color):

- Tinta profunda (fondo base): #161310

- Pergamino envejecido (superficie de paneles/scrolls): #2B2620

- Bronce oxidado (marcos, bordes, anillos del astrolabio): #8A6A3D

- Oro viejo (detalle metálico, estados hover/highlight): #C9A227

- Sello bermellón (acento primario: CTAs, número de daño total, estados activos): #A8342A

- Verdín apagado (acento secundario: confirmaciones, estados de éxito): #5F7A6E

- Las 6 piedras dragón (Diamante, Rubí, Jade, Zafiro, Granate, Ónice) usan sus colores literales únicamente dentro del módulo de alquimia, no como parte de la paleta global de la UI.



Tipografía (roles):

- Display (títulos de módulo, número de daño total): fuente con carácter de trazo de pincel/caligráfico, usada con moderación (no en párrafos ni datos densos).

- Secundaria técnica (etiquetas de stats, dial del astrolabio): serif grabada, con aire de instrumento antiguo.

- Body: sans-serif limpia y neutra para texto general.

- Utility (valores numéricos, tablas de bonos, grados de pureza): monoespaciada tabular para alineación de columnas de datos.



Concepto de layout: toda la aplicación se trata visualmente como un pergamino desenrollado montado en un marco de bronce. Los paneles principales (equipamiento, stats, mascota, alquimia) son "hojas" de pergamino con bordes ligeramente irregulares (deckled edge), y cada slot o control interactivo lleva un engaste de bronce grabado en vez de un border-radius genérico.



Elemento distintivo (signature): la rueda de alquimia se renderiza como un astrolabio de bronce mecánico real, con anillos concéntricos que giran físicamente al seleccionar una piedra dragón. Los anillos están grabados con caligrafía a pincel. Al confirmar la selección de una piedra, un sello bermellón se estampa con una animación de trazo de tinta sobre el pergamino debajo del anillo correspondiente — este gesto (giro mecánico del anillo + estampado de sello) reemplaza cualquier patrón genérico de "toast de confirmación" y es el momento que debe distinguir visualmente a este producto de cualquier otra calculadora del juego.



Animaciones (Framer Motion): La web no debe ser estática. Implementa efectos de hover suaves en los slots de equipamiento (resplandor sutil de bronce/oro), transiciones de fundido cruzado (fade-in/out) al cambiar entre pestañas (Inventario, Alquimia, Mascota) y ventanas modales que emerjan con un ligero efecto de escala (scale: 0.95 a 1).



Arquitectura de Componentes e Interfaz:

La interfaz central debe imitar las ventanas del juego mediante contenedores modulares. Al hacer clic en un "slot" (hueco de inventario), debe abrirse un modal interactivo que consuma la API para mostrar los ítems disponibles y permitir seleccionar sus bonus.



Desarrolla los siguientes módulos basándote en esta estructura:



Módulo de Equipamiento Principal y Atuendos (Refs: image\_cac6cd.png y image\_cb1cc7.png):



Crea una cuadrícula visual (Grid) que simule la silueta del personaje.



Slots izquierdos: Arma, Armadura.



Slots derechos: Casco, Escudo, Pulsera, Pendientes, Collar, Zapatos.



Sistema de Atuendos: Un botón/pestaña superpuesta para cambiar la vista a los disfraces (Peinado, Atuendo, Skin de Arma), Estola (con su porcentaje de absorción) y Vestimenta de Aura.



Interacción: Al hacer clic, se despliega un buscador con filtros (nivel, tipo) conectado a la base de datos de Supabase.



Módulo de Alquimia de Piedras Dragón (Ref: image\_caca10.jpg):



Crea una interfaz circular o de rueda dividida en 6 ranuras (Diamante, Rubí, Jade, Zafiro, Granate, Ónice).



Debe permitir seleccionar la pureza (Mítica), el grado (Clara, Impecable, Excelente) y los bonos aleatorios correspondientes (ej. Resistencia a Media, Daño de Media).



Módulo de Mascotas (Ref: image\_caca90.png):



Un panel dedicado donde se configure el Nivel de la mascota, los Días de vida (para el escalado de stats), y los porcentajes fijos de HP, Defensa y SP.



Tres slots inferiores para añadir las habilidades activas de la mascota (ej. Berserker, Perforador, Vampirismo).



Módulo de Estado del Personaje (Ref: image\_cb1d44.png):



Un panel lateral visible en todo momento.



Selectores para: Raza (Guerrero, Sura, Ninja, Chamán), Nivel del personaje (1-120+) y Nivel de Campeón.



Campos numéricos (inputs) para asignar los puntos de estado básicos: VIT, INT, STR, DEX. Estos valores deben alterar dinámicamente el daño base y la HP en el estado global de la aplicación.



Especificación de Interacciones (UX detallado):

- Validación de stats (VIT/INT/STR/DEX): el input numérico tiene como máximo los puntos disponibles según nivel + campeón. Si el usuario excede ese total, el campo se detiene en el máximo y muestra un mensaje inline ("Puntos disponibles: 0"), sin alert ni popup. Todo recalcula en vivo, sin botón "aplicar".

- Comportamiento de slots ocupados: click en un slot con ítem reabre el mismo modal buscador con el ítem actual resaltado (para comparar rápido) y reemplaza directo al confirmar, sin pedir confirmación adicional. Slot vacío = placeholder con "+"; slot ocupado = miniatura del ítem + badge de grado/pureza.

- Sin drag-and-drop entre slots (decisión explícita): cada slot representa un tipo de ítem fijo (arma, casco, etc.), no hay intercambio libre entre slots como en un inventario real, así que drag-and-drop no aporta valor y solo suma fricción en mobile. Click + modal es el único mecanismo de selección.

- Resultado de daño siempre visible + tooltips: el número de daño total (aunque hoy sea placeholder) vive fijo en el panel lateral de Estado del Personaje y se recalcula en vivo con cualquier cambio en cualquier módulo. Cada stat/bono tiene tooltip explicativo on-hover (y on-tap en mobile).

- Loading/empty states + accesibilidad del modal: el buscador muestra skeleton loaders mientras consulta Supabase; si los filtros no arrojan resultados, mostrar un empty state accionable (ej. "No hay ítems con estos filtros — probá bajar el nivel mínimo"). El modal cierra con Esc, atrapa el foco de teclado (focus trap), y en mobile se despliega full-screen en vez de centrado.



Lógica de la API y Seguridad:



Diseña una estructura de base de datos relacional para separar los atributos base del objeto de sus bonos aleatorios.



Asegúrate de que la lógica matemática pesada del cálculo de daño final resida en el estado central de React (Zustand o Jotai) o mediante llamadas Serverless para garantizar velocidad.



Motor de cálculo (nota de alcance): las fórmulas de daño PvP y PvM aún están en investigación y quedan fuera del alcance de esta etapa. El motor de cálculo debe construirse como un módulo aislado (ej. una función calcularDaño(build) o un endpoint serverless dedicado) que por ahora devuelva valores placeholder con forma correcta (número total, breakdown por fuente: equipo/stats/piedras/mascota), de modo que el resto del sistema (UI, estado del build, guardado en Supabase) se pueda construir y probar sin bloquearse en la fórmula real. Cuando la investigación de fórmulas esté lista, solo ese módulo se reemplaza.



Autenticación y Builds Guardados:

- Auth sin fricción y opcional: Supabase Auth con magic link/email + login social de Google. La calculadora funciona completa sin cuenta; el login solo se pide al intentar guardar, comparar o compartir un build.

- Límite de builds por usuario: hasta 10 builds guardados por cuenta, cada uno con nombre editable y timestamp de última edición.

- Compartir por URL pública con slug único: cada build guardado obtiene un link tipo /build/[slug] visible sin login (read-only para quien no es el dueño), aprovechando el SEO de Next.js.

- Comparación de builds lado a lado: seleccionar 2 builds (propios o por link) y mostrar el breakdown de daño diferenciado, indicando qué cambió entre uno y otro y cuánto impactó cada diferencia.

- Row Level Security (RLS) en Supabase: cada build tiene user_id; políticas RLS permiten editar/borrar solo al dueño, pero permiten lectura pública si el build está marcado como compartido vía su slug.

