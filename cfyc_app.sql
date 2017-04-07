drop database if exists cfyc_app;
CREATE DATABASE cfyc_app;
use cfyc_app;

create table member(
id int not null auto_increment,
email varchar(60),
pword varchar(20),
constraint PK_member primary key (id)
);

create table videos(
id int not null auto_increment,
videoName varchar(60),
videoText varchar(8000),
constraint PK_member primary key (id)
);

create table trackVideo(
id int not null auto_increment,
video varchar(60),
videoEmail varchar(60),
watched varchar(10),
constraint PK_member primary key (id),
foreign key (videoEmail) references member(email),
foreign key (video) references videos(videoName)
);



insert into member values('1', 'stceburns@gmail.com', 'mypassword');
insert into member values('2', 'donkey@gmail.com', 'kong');

insert into videos values('1', 'feeding1', 'Some text about video ONE');
insert into videos values('2', 'feeding2', 'Some text about video TWO');
insert into videos values('3', 'testvid', 'Some text about TESTVID');





