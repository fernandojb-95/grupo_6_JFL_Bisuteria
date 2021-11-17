DROP DATABASE IF EXISTS jfl_database;
CREATE DATABASE jfl_database;
USE jfl_database;

drop table if exists `users`;
create table users(
`id` int(10) unsigned unique auto_increment not null,
`first_name` varchar(100) not null,
`last_name` varchar(100) not null,
`email` varchar(100) not null,
`password` varchar(200) not null,
`isAdmin` tinyint not null,
`image` varchar(100) null default 'default-user.png',
primary key (`id`));

drop table if exists `categories`;
create table categories(
`id` int(10) unsigned unique auto_increment not null,
`name` varchar(50) not null,
primary key (`id`));

drop table if exists `materials`;
create table materials(
`id` int(10) unsigned unique auto_increment not null,
`name` varchar(50) not null,
primary key (`id`));

drop table if exists `products`;
create table products(
`id` int(10) unsigned unique auto_increment not null,
`name` varchar(100) not null,
`description` varchar(300) not null,
`price` decimal(7,2) not null,
`discount` decimal(4,2) not null,
`quantity_S` int(10) unsigned null default 0,
`quantity_M` int(10) unsigned null default 0,
`quantity_L` int(10) unsigned null default 0,
`image_1` varchar(100) NULL DEFAULT 'default-image.svg',
`image_2` varchar(100) NULL DEFAULT 'default-image.svg',
`sold` int(10) unsigned null default 0,
`category_id` int(10) unsigned not null,
`material_id` int(10) unsigned not null,
primary key (`id`),
foreign key(`category_id`) references `categories`(`id`),
foreign key(`material_id`) references `materials`(`id`));


drop table if exists `shop_cart`;
create table shop_cart(
`id` int(10) unsigned unique auto_increment not null,
`user_id` int(10) unsigned not null,
`total_items` int(10) null default 0,
`total_price` decimal(7,2) not null,
primary key (`id`),
foreign key(`user_id`) references `users`(`id`));

drop table if exists `shop_cart_products`;
create table shop_cart_products(
`id` int(10) unsigned unique auto_increment not null,
`product_id` int(10) unsigned not null,
`shop_cart_id` int(10) unsigned not null,
primary key (`id`),
foreign key(`product_id`) references `products`(`id`),
foreign key(`shop_cart_id`) references `shop_cart`(`id`));
