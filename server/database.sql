CREATE DATABASE chatapp;

CREATE TABLE users(
  user_id uuid PRIMARY KEY DEFAULT
  uuid_generate_v4(),
  user_name VARCHAR(256) NOT NULL,
  user_email VARcHAR(256) NOT NULL,
  user_password VARCHAR(256) NOT NULL
);

INSERT INTO users (user_name, user_email, user_password) VALUES ('dogeuser', 'doge@such.email', 'WoWSuchPassword');