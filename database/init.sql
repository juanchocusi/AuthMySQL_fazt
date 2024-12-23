

ALTER TABLE tasks ADD COLUMN user_id INTEGER REFERENCES users(id)


create table users(
    id serial primary key,
    name varchar (255) not null,
    password varchar (255) not null,
    email varchar (255) unique not null,
    created_at timestamp default current_timestamp,
    updated_at timestamp default current_timestamp
)

ALTER TABLE users ADD COLUMN grvatar VARCHAR(255)

