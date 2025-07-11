-- 001_create_tables.sql: Initial schema for nuxhub

CREATE TABLE IF NOT EXISTS applications (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  tags TEXT
);

CREATE TABLE IF NOT EXISTS environments (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  tags TEXT
);

CREATE TABLE IF NOT EXISTS versions (
  id TEXT PRIMARY KEY,
  appId TEXT NOT NULL,
  name TEXT NOT NULL,
  createdAt TEXT NOT NULL,
  isSnapshot INTEGER,
  metadata TEXT
);

CREATE TABLE IF NOT EXISTS deployments (
  id TEXT PRIMARY KEY,
  appId TEXT NOT NULL,
  envId TEXT NOT NULL,
  versionId TEXT NOT NULL,
  status TEXT,
  deployedAt TEXT
); 