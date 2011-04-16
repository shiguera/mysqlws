drop database pruebasmysqlws;

create database pruebasmysqlws;

use pruebasmysqlws;

create table nombres (
    id integer primary key auto_increment,
    nombre varchar(250)
) engine=innodb, charset=utf8;

insert into nombres values (null, "Pepe"), (null, "Juan"), (null, "María");

