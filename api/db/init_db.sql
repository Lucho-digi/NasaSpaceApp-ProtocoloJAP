CREATE DATABASE raincheck_db;

\c raincheck_db;

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT(255) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE alerts (
    id SERIAL PRIMARY KEY,
        -- user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    lat DOUBLE PRECISION NOT NULL,
    lon DOUBLE PRECISION NOT NULL,
    alert_type TEXT NOT NULL,
    thershold NUMERIC,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW(),
    last_triggered_at TIMESTAMP
);

CREATE TABLE forecast_cache (
    id SERIAL PRIMARY KEY,
    lat DOUBLE PRECISION NOT NULL,
    lon DOUBLE PRECISION NOT NULL,
    forecast_date DATE NOT NULL,
    result JSONB NOT NULL,
    source TEXT DEFAULT 'NASA_OPeNDAP',
    created_at TIMESTAMP DEFAULT NOW(),
    geom geometry(Point, 4326),  -- Punto geoespacial (lat/lon)
    UNIQUE(lat, lon, forecast_date)
);

CREATE INDEX idx_forecast_cache_geom ON forecast_cache USING GIST(geom);

CREATE TABLE query_logs (
    id SERIAL PRIMARY KEY,
    lat DOUBLE PRECISION,
    lon DOUBLE PRECISION,
    forecast_date DATE,
    request_time TIMESTAMP DEFAULT NOW(),
    duration_ms INT,
    success BOOLEAN,
);

CREATE TABLE climate_indices (
    id SERIAL PRIMARY KEY,
    lat DOUBLE PRECISION NOT NULL,
    lon DOUBLE PRECISION NOT NULL,
    period_start DATE NOT NULL,
    period_end DATE NOT NULL,
    spi NUMERIC,
    spei NUMERIC,
    gdd NUMERIC,
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(lat, lon, period_start, period_end)
);

CREATE TABLE IF NOT EXISTS climate_cache (
    id SERIAL PRIMARY KEY,
    latitude FLOAT NOT NULL,
    longitude FLOAT NOT NULL,
    date_requested DATE NOT NULL,
    result JSONB NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE dataset_metadata (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    version TEXT,
    url TEXT,
    last_updated TIMESTAMP,
    description TEXT,
);