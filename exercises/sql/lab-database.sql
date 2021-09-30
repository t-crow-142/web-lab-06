-- Run this script to create or re-initialize the database.

drop table if exists users;

create table users (

    id integer not null primary key,
    username varchar(64) unique not null,
    password varchar(64) not null,
    name varchar(64),
    authToken varchar(128)

);

insert into users (id, username, password, name) values
    (1, 'user1', 'pa55word', 'Alice'),
    (2, 'user2', 'pa55word', 'Bob');