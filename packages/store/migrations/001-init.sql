CREATE TABLE migrations
(
  namespace  VARCHAR NOT NULL,
  number     INT,
  name       VARCHAR NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  hash       VARCHAR
);

CREATE INDEX namespace_number_idx ON migrations (namespace, number);
