-- migrate:up
create table users (
  id integer auto_increment PRIMARY KEY not null,
  name varchar(255),
  email varchar(255) not null unique, 
  password varchar(255) not null,
  type integer not null default 0, /* 0 for instructor and 1 for students */
  created_at timestamp default current_timestamp, 
  updated_at datetime default current_timestamp on update current_timestamp
);

-- migrate:down
drop table if exists users;