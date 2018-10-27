SET FOREIGN_KEY_CHECKS=0;


CREATE TABLE admin_users (
    id VARCHAR(36) NOT NULL,
    email VARCHAR(100) NOT NULL,
    `password` VARCHAR(60) NOT NULL,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    is_active TINYINT(1) NOT NULL DEFAULT 0,
    token VARCHAR(200),
    created_at DATETIME NOT NULL,
    deleted_at DATETIME,
    PRIMARY KEY(id)
)ENGINE=INNODB DEFAULT CHARSET=utf8;

CREATE TABLE users (
    id VARCHAR(36) NOT NULL,
    email VARCHAR(100) NOT NULL,
    `password` VARCHAR(60) NOT NULL,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    is_verified TINYINT(1) NOT NULL DEFAULT 0,
    token VARCHAR(200),
    created_at DATETIME NOT NULL,
    deleted_at DATETIME,
    PRIMARY KEY(id)
)ENGINE=INNODB DEFAULT CHARSET=utf8;

CREATE TABLE tokens(
    id VARCHAR(36) NOT NULL,
    title VARCHAR(200) NOT NULL,
    symbol CHAR(4) NOT NULL,
    price DECIMAL(15,2) NOT NULL,
    deleted_at DATETIME,
    PRIMARY KEY(id)
)ENGINE=INNODB DEFAULT CHARSET=utf8;

CREATE TABLE nodes(
    id VARCHAR(36) NOT NULL,
    title VARCHAR(200) NOT NULL,
    token_id VARCHAR(36) NOT NULL,
    total_tokens DECIMAL(15,2) NOT NULL,
    deployment_at DATETIME,
    daily_rewards DECIMAL(15,2) NOT NULL,
    total_rewards DECIMAL(15,2) DEFAULT 0 NOT NULL,
    is_available TINYINT(1) DEFAULT 0 NOT NULL,
    deleted_at DATETIME,
    PRIMARY KEY(id),
    CONSTRAINT `FK_nodes_tokens` 
        FOREIGN KEY  (`token_id`)
        REFERENCES `tokens`(`id`)
)ENGINE=INNODB DEFAULT CHARSET=utf8;

CREATE TABLE users_own_nodes(
    id VARCHAR(36) NOT NULL,
    user_id VARCHAR(36) NOT NULL,
    node_id VARCHAR(36) NOT NULL,
    amount DECIMAL(15,2) NOT NULL,
    created_at DATETIME NOT NULL,
    PRIMARY KEY(id),
    CONSTRAINT `FK_users_nodes_users` 
        FOREIGN KEY  (`user_id`)
        REFERENCES `users`(`id`),
    CONSTRAINT `FK_users_nodes_nodes` 
        FOREIGN KEY  (`node_id`)
        REFERENCES `nodes`(`id`)
)ENGINE=INNODB DEFAULT CHARSET=utf8;

CREATE TABLE users_nodes_rewards(
    id VARCHAR(36) NOT NULL,
    user_id VARCHAR(36) NOT NULL,
    node_id VARCHAR(36) NOT NULL,
    amount DECIMAL(15,2) NOT NULL,
    paid_at DATETIME NOT NULL,
    withdrawl_at DATETIME,
    PRIMARY KEY(id),
    CONSTRAINT `FK_users_nodes_rewards_users` 
        FOREIGN KEY  (`user_id`)
        REFERENCES `users`(`id`),
    CONSTRAINT `FK_users_nodes_rewards_nodes` 
        FOREIGN KEY  (`node_id`)
        REFERENCES `nodes`(`id`)
)ENGINE=INNODB DEFAULT CHARSET=utf8;

insert into `admin_users` (`id`, `email`, `password`, `first_name`, `last_name`, `is_active`, `token`, `created_at`, `deleted_at`) values('123232324324242424242ffvdsdsv','daniel.chrysostomos@gmail.com','$2a$10$G7JdxwyVGIi5yj7c7KwHWe09nUlU.a2xTJpUA4ZSp3gGuLmSDNDU.','Chrysostomos','Daniel','1','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEyMzIzMjMyNDMyNDI0MjQyNDI0MmZmdmRzZHN2IiwiaWF0IjoxNTQwNTM3MDg5LCJleHAiOjE1NDA2MjM0ODl9.4poBK5rh20GHOonhy5qLOiiNL97tzxKU83shf7v5BOw','2018-06-04 21:38:20',NULL);


SET FOREIGN_KEY_CHECKS=1;