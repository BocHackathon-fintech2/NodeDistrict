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

CREATE TABLE users(
    id VARCHAR(36) NOT NULL,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    email VARCHAR(60) NOT NULL,
    `password` VARCHAR(100) NOT NULL,
    verify_token VARCHAR(30),
    is_verified TINYINT(1) NOT NULL DEFAULT 0,
    token VARCHAR(200),
    created_at DATETIME NOT NULL,
    deleted_at DATETIME,
    PRIMARY KEY(id)
)ENGINE=INNODB DEFAULT CHARSET=utf8;


SET FOREIGN_KEY_CHECKS=1;