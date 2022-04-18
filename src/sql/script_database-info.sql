create schema webInfo;

create table mailStatus( id serial not null primary key, idMail varchar(40),status varchar(12) );
