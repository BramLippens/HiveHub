CREATE TABLE `movies` (
	`id` int unsigned AUTO_INCREMENT NOT NULL,
	`title` varchar(255) NOT NULL,
	`director` varchar(255) NOT NULL,
	`release_year` int NOT NULL,
	`barcode` varchar(13) NOT NULL,
	`genre` varchar(100) NOT NULL,
	`rating` decimal(3,1),
	CONSTRAINT `movies_id` PRIMARY KEY(`id`),
	CONSTRAINT `idx_barcode_unique` UNIQUE(`barcode`)
);
