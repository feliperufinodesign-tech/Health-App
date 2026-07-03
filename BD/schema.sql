-- ================================================================
-- App de Rotina & Saúde — Schema completo
-- Rode este arquivo no SQL Editor do Supabase Dashboard
-- ================================================================

-- ALIMENTAÇÃO ---------------------------------------------------

create table foods (
  id            uuid primary key default gen_random_uuid(),
  nome          text not null,
  unidade       text not null,        -- 'g' | 'ml' | 'unidade' | 'lata' | 'colher'
  base_qtd      numeric not null,     -- ex: 100 (por 100g) ou 1 (por lata)
  kcal          numeric not null,
  proteina_g    numeric default 0,
  carbo_g       numeric default 0,
  gordura_g     numeric default 0,
  ativo         boolean default true
);

create table meal_logs (
  id            uuid primary key default gen_random_uuid(),
  data          date not null,
  refeicao      text not null,        -- 'cafe' | 'almoco' | 'jantar' | 'lanche'
  criado_em     timestamptz default now()
);

create table meal_items (
  id            uuid primary key default gen_random_uuid(),
  meal_log_id   uuid references meal_logs(id) on delete cascade,
  food_id       uuid references foods(id),
  quantidade    numeric not null,
  kcal_calc     numeric,
  prot_calc     numeric,
  carbo_calc    numeric,
  gord_calc     numeric
);

-- TREINO --------------------------------------------------------

create table workout_plans (
  id      uuid primary key default gen_random_uuid(),
  nome    text not null,
  ativo   boolean default true
);

create table plan_days (
  id        uuid primary key default gen_random_uuid(),
  plan_id   uuid references workout_plans(id) on delete cascade,
  dia       text not null,            -- 'seg' | 'ter' | ... ou 'A' | 'B'
  nome      text                      -- ex: "Peito e Tríceps"
);

create table plan_exercises (
  id            uuid primary key default gen_random_uuid(),
  plan_day_id   uuid references plan_days(id) on delete cascade,
  nome          text not null,
  series_alvo   int,
  reps_alvo     text,                 -- '8-12'
  carga_alvo    numeric,
  ordem         int,
  obs           text
);

create table workout_sessions (
  id            uuid primary key default gen_random_uuid(),
  data          date not null,
  plan_day_id   uuid references plan_days(id),
  concluido     boolean default false,
  notas         text
);

create table session_sets (
  id                uuid primary key default gen_random_uuid(),
  session_id        uuid references workout_sessions(id) on delete cascade,
  plan_exercise_id  uuid references plan_exercises(id),
  nome_exercicio    text,
  serie_num         int,
  carga             numeric,
  reps              int,
  concluido         boolean default false
);

-- SONO ----------------------------------------------------------

create table sleep_logs (
  id             uuid primary key default gen_random_uuid(),
  data           date not null unique,
  hora_dormir    time,
  hora_acordar   time,
  vezes_acordou  int default 0,
  dormiu_bem     boolean,
  tipo_sono      text,                 -- 'leve' | 'pesado'
  disposicao     int,                  -- 1 a 5
  notas          text,
  criado_em      timestamptz default now()
);

-- MEDICAÇÃO -----------------------------------------------------

create table medications (
  id        uuid primary key default gen_random_uuid(),
  nome      text not null,
  dose      text,
  horarios  jsonb not null,           -- ["08:00","20:00"]
  ativo     boolean default true
);

create table med_logs (
  id                uuid primary key default gen_random_uuid(),
  medication_id     uuid references medications(id) on delete cascade,
  data              date not null,
  horario_previsto  time not null,
  datahora_marcado  timestamptz default now(),
  tomado_no_horario boolean,
  observacao        text
);

-- IA ------------------------------------------------------------

create table ai_reports (
  id             uuid primary key default gen_random_uuid(),
  tipo           text,                -- 'semanal' | 'diario'
  periodo_inicio date,
  periodo_fim    date,
  conteudo       text,
  criado_em      timestamptz default now()
);

create table ai_messages (
  id         uuid primary key default gen_random_uuid(),
  papel      text,                    -- 'user' | 'assistant'
  conteudo   text,
  criado_em  timestamptz default now()
);
