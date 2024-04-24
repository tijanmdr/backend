-- migrate:up
create table user_details (
  id integer auto_increment PRIMARY KEY not null,
  user integer not null,
  phone varchar(255) not null,
  address varchar(255),
  foreign key (user) references users(id),
  dob date not null,
  license integer not null,
  license_expiry date not null,
  transmission integer not null default 0, /* 0 - auto, 1 - manual */
  school_work varchar(255),
  car_rego integer default 0, /* Set up in json */
  created_at timestamp default current_timestamp,
  updated_at datetime default current_timestamp on update current_timestamp
);

-- migrate:down
drop table if exists user_details;
