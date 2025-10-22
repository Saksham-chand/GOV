CREATE TABLE IF NOT EXISTS districts (
id serial PRIMARY KEY,
state_code varchar(10),
district_code varchar(50),
name text
);


CREATE TABLE IF NOT EXISTS metrics_monthly (
id serial PRIMARY KEY,
district_id int REFERENCES districts(id),
year int,
month int,
total_beneficiaries bigint,
total_person_days bigint,
funds_spent numeric,
works_completed int,
raw jsonb,
created_at timestamptz DEFAULT now()
);


-- seed example
INSERT INTO districts(state_code, district_code, name) VALUES
('UP','AGRA','Agra'),
('UP','LCK','Lucknow')
ON CONFLICT DO NOTHING;