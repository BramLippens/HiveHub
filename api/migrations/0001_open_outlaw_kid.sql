CREATE TABLE `users` (
	`id` int unsigned AUTO_INCREMENT NOT NULL,
	`email` varchar(255) NOT NULL,
	`username` varchar(100) NOT NULL,
	`password_hash` varchar(255) NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `users_id` PRIMARY KEY(`id`),
	CONSTRAINT `idx_email_unique` UNIQUE(`email`),
	CONSTRAINT `idx_username_unique` UNIQUE(`username`)
);
--> statement-breakpoint
ALTER TABLE `movies` MODIFY COLUMN `rating` float;