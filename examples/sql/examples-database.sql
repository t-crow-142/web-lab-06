-- Run this script to create or re-initialize the database.

drop table if exists messages;

create table messages (
    id integer not null primary key,
    content text
);