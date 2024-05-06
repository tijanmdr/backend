-- migrate:up
create table lesson_received (
  id integer auto_increment PRIMARY KEY not null,
  student integer not null,
  driver integer not null,
  foreign key (student) references users(id),
  foreign key (driver) references users(id),
  taught varchar(255) not null default "[]",
  competencies_assessed varchar(255) not null default "[]",
  achieved varchar(255) not null default "[]",
  start_time time not null,
  end_time time not null,
  start_odo integer not null,
  end_odo integer not null,
  date_received date not null,
  location varchar(255) not null,
  comments text,
  created_at timestamp default current_timestamp,
  updated_at datetime default current_timestamp on update current_timestamp
);

-- migrate:down
drop table if exists lesson_received;
