CREATE DATABASE chatapp;

CREATE TABLE users(
  user_id uuid PRIMARY KEY DEFAULT
  uuid_generate_v4(),
  user_name VARCHAR(256) NOT NULL,
  user_email VARCHAR(256) NOT NULL,
  user_password VARCHAR(256) NOT NULL
);

CREATE TABLE conversations(
  conversation_id SERIAL PRIMARY KEY,
  conversation_name VARCHAR(256) NOT NULL
);

CREATE TABLE conversation_users(
  cu_id SERIAL PRIMARY KEY,
  conversation_id INT,
  user_id uuid,
  user_name VARCHAR(256) NOT NULL,
  FOREIGN KEY (conversation_id)
    REFERENCES conversations(conversation_id),
  FOREIGN KEY (user_id)
    REFERENCES users(user_id)
);

CREATE TABLE messages(
  mesage_id SERIAL PRIMARY KEY,
  message_date DATE NOT NULL DEFAULT CURRENT_DATE,
  message_time TIME NOT NULL DEFAULT LOCALTIME(0),
  message_content VARCHAR(512) NOT NULL,
  sender_id uuid NOT NULL,
  conversation_id INT NOT NULL,
  FOREIGN KEY (sender_id)
    REFERENCES users(user_id),
  FOREIGN KEY (conversation_id)
    REFERENCES conversations(conversation_id)
);