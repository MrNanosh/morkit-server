create type item_options as enum ('yes', 'no', 'maybe');
create type item_status as enum ('buying', 'selling', 'unavailable', 'fulfilled');

create table inventory (
id integer primary key generated by default as identity,
item_name text not null,
item_body text,
item_is item_status
);

create table msg (
id integer primary key generated by default as identity,
sender_id integer references user(id) on delete cascade not null,
receiver_id integer references user(id) on delete cascade not null,
send_time timestamp default now() not null,
content text, 
buy boolean default false not null,
check_available boolean default false not null,
rsp_buy item_options,
rsp_check_available item_options, 
rsp_content text
);

create table user (
id integer primary key generated by default as identity,
username text not null,
since timestamp default now() not null,
password text not null,
fullname text not null,
desc text
);