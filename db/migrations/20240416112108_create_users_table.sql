-- migrate:up
create table users (
  id integer auto_increment PRIMARY KEY,
  name varchar(255),
  email varchar(255) not null, 
  password varchar(255) not null, 
  created_at datetime, 
  updated_at datetime
);

-- migrate:down
drop table if exists users;