-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Feb 23, 2025 at 02:21 PM
-- Server version: 10.4.27-MariaDB
-- PHP Version: 8.1.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `product_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `categories`
--

CREATE TABLE `categories` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `parent_id` bigint(20) UNSIGNED NOT NULL DEFAULT 0,
  `image_url` varchar(255) DEFAULT NULL,
  `created_at` datetime(3) DEFAULT NULL,
  `updated_at` datetime(3) DEFAULT NULL,
  `slug` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `status` enum('active','inactive') NOT NULL DEFAULT 'active'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `categories`
--

INSERT INTO `categories` (`id`, `name`, `parent_id`, `image_url`, `created_at`, `updated_at`, `slug`, `description`, `image`, `status`) VALUES
(1, 'Solar Power Systems', 0, NULL, '2025-02-23 08:51:27.628', '2025-02-23 12:06:05.281', 'solar-power-systems', 'Solar Power Systems', 'categories/solar-power-systems.jpg', 'active'),
(2, 'On-Grid Solar System', 1, NULL, '2025-02-23 09:08:31.788', '2025-02-23 12:07:47.575', 'on-grid-solar-system', 'Connected to the grid, allows net metering for energy savings.', 'categories/on-grid-solar-system.jpg', 'active'),
(3, 'Off-Grid Solar System', 1, NULL, '2025-02-23 09:09:34.501', '2025-02-23 12:08:44.712', 'off-grid-solar-system', 'Independent system with battery storage for remote locations', 'categories/off-grid-solar-system.jpg', 'active'),
(4, 'Hybrid Solar System', 1, NULL, '2025-02-23 09:10:04.666', '2025-02-23 12:10:07.960', 'hybrid-solar-system', 'Combines grid and battery backup for reliable power supply.', 'categories/hybrid-solar-system.jpg', 'active'),
(5, 'Solar Panels', 0, NULL, '2025-02-23 09:12:55.902', '2025-02-23 12:04:36.071', 'solar-panels', 'Solar Panels', 'categories/solar-panels.jpg', 'active'),
(6, 'Monocrystalline Solar Panels', 5, NULL, '2025-02-23 09:13:55.887', '2025-02-23 11:49:00.120', 'monocrystalline-solar-panels', 'High efficiency, premium quality panels.', 'categories/monocrystalline-solar-panels.jpg', 'active'),
(7, 'Polycrystalline Solar Panels', 5, NULL, '2025-02-23 09:14:32.510', '2025-02-23 11:59:46.340', 'polycrystalline-solar-panels', 'Affordable panels with moderate efficiency.', 'categories/polycrystalline-solar-panels.jpg', 'active'),
(8, 'Thin-Film Solar Panels', 5, NULL, '2025-02-23 09:15:01.446', '2025-02-23 12:02:55.245', 'thin-film-solar-panels', 'Lightweight and flexible panels, less efficient but versatile', 'categories/thin-film-solar-panels.jpg', 'active'),
(9, 'Solar Energy Storage', 0, NULL, '2025-02-23 09:16:20.911', '2025-02-23 12:14:07.853', 'solar-energy-storage', 'Solar Energy Storage', 'categories/solar-energy-storage.jpg', 'active'),
(10, 'Lithium-Ion Batteries', 9, NULL, '2025-02-23 09:17:06.341', '2025-02-23 12:16:11.624', 'lithium-ion-batteries', 'High-efficiency rechargeable batteries for solar storage.', 'categories/lithium-ion-batteries.jpg', 'active'),
(11, 'Lead-Acid Batteries', 9, NULL, '2025-02-23 09:17:43.741', '2025-02-23 12:17:47.384', 'lead-acid-batteries', 'Cost-effective battery storage with shorter lifespan.', 'categories/lead-acid-batteries.jpg', 'active'),
(13, 'Solar Power Accessories', 0, NULL, '2025-02-23 09:40:29.567', '2025-02-23 12:37:16.333', 'solar-power-accessories', 'Solar Power Accessories', 'categories/solar-power-accessories.jpg', 'active'),
(14, 'String Inverter', 13, NULL, '2025-02-23 09:41:22.640', '2025-02-23 12:21:52.277', 'string-inverter', 'Converts DC to AC for multiple solar panels.', 'categories/string-inverter.jpg', 'active'),
(15, 'Microinverter', 13, NULL, '2025-02-23 09:41:47.119', '2025-02-23 12:23:02.687', 'microinverter', 'Microinverter', 'categories/microinverter.jpg', 'active'),
(17, 'Hybrid Inverter', 13, NULL, '2025-02-23 09:43:25.163', '2025-02-23 12:23:59.573', 'hybrid-inverter', 'Works with grid and battery storage for hybrid systems.', 'categories/hybrid-inverter.jpg', 'active'),
(18, 'MPPT Charge Controller', 13, NULL, '2025-02-23 09:43:56.791', '2025-02-23 12:24:58.836', 'mppt-charge-controller', 'Maximizes energy efficiency for battery charging.', 'categories/mppt-charge-controller.jpg', 'active'),
(19, 'PWM Charge Controller', 13, NULL, '2025-02-23 09:44:43.436', '2025-02-23 12:26:21.881', 'pwm-charge-controller', 'pwm-charge-controller', 'categories/pwm-charge-controller.jpg', 'active'),
(20, 'Solar Water Systems', 0, NULL, '2025-02-23 09:45:27.306', '2025-02-23 12:30:08.230', 'solar-water-systems', 'Solar Water Systems', 'categories/solar-water-systems.webp', 'active'),
(21, 'Solar Water Heater', 20, NULL, '2025-02-23 09:46:10.477', '2025-02-23 12:31:28.695', 'solar-water-heater', 'Uses solar thermal energy to heat water.', 'categories/solar-water-heater.webp', 'active'),
(22, 'Solar Pumps', 20, NULL, '2025-02-23 09:46:53.699', '2025-02-23 12:32:33.818', 'solar-pumps', 'Water pumping solutions powered by solar energy.', 'categories/solar-pumps.webp', 'active'),
(23, 'Solar Desalination', 20, NULL, '2025-02-23 09:47:28.425', '2025-02-23 12:33:33.133', 'solar-desalination', 'Converts seawater into drinkable water using solar power.', 'categories/solar-desalination.webp', 'active'),
(24, 'Solar Lighting & Appliances ', 0, NULL, '2025-02-23 09:57:30.295', '2025-02-23 12:42:22.996', 'solar-lighting-appliances ', 'Solar Lighting & Appliances ', 'categories/solar-lighting-appliances .webp', 'active'),
(25, 'Solar Street Lights', 24, NULL, '2025-02-23 09:58:05.331', '2025-02-23 09:58:05.331', 'solar-street-lights', 'Solar-powered outdoor lighting solutions.', '', 'active'),
(27, 'Solar Fans', 24, NULL, '2025-02-23 09:59:07.730', '2025-02-23 12:40:47.933', 'solar-fans', 'DC-powered fans using solar energy.', 'categories/solar-fans.webp', 'active'),
(28, 'Solar Home Lighting', 24, NULL, '2025-02-23 10:01:09.935', '2025-02-23 12:41:35.474', 'solar-home-lighting', 'Indoor solar lighting kits for homes.', 'categories/solar-home-lighting.webp', 'active'),
(29, 'Solar Cookers', 24, NULL, '2025-02-23 10:02:20.862', '2025-02-23 10:02:20.862', 'solar-cookers', 'Solar-powered cooking appliances', '', 'active'),
(30, 'Specialized Solar Solutions', 0, NULL, '2025-02-23 10:03:38.829', '2025-02-23 12:43:46.066', 'specialized-solar-solutions', 'Specialized Solar Solutions', 'categories/specialized-solar-solutions.jpg', 'active'),
(31, 'Solar-Powered EV Chargers', 30, NULL, '2025-02-23 10:04:34.553', '2025-02-23 12:44:56.239', 'solar-ev-chargers', 'Charges electric vehicles using solar power.', 'categories/solar-ev-chargers.jpg', 'active'),
(32, 'Solar Air Conditioners', 30, NULL, '2025-02-23 10:05:06.839', '2025-02-23 12:45:50.911', 'solar-air-conditioners', 'Uses solar power for cooling and ventilation.', 'categories/solar-air-conditioners.jpg', 'active'),
(33, 'Solar-Powered CCTV Cameras', 30, NULL, '2025-02-23 10:05:37.114', '2025-02-23 12:46:47.294', 'solar-cctv-cameras', 'Security cameras running on solar energy', 'categories/solar-cctv-cameras.jpg', 'active');

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

CREATE TABLE `products` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `price` decimal(10,2) NOT NULL,
  `brand` varchar(100) NOT NULL,
  `category_id` bigint(20) UNSIGNED NOT NULL,
  `image_url` varchar(255) DEFAULT NULL,
  `created_at` datetime(3) DEFAULT NULL,
  `updated_at` datetime(3) DEFAULT NULL,
  `slug` varchar(255) NOT NULL,
  `discount` decimal(5,2) DEFAULT 0.00,
  `stock` bigint(20) NOT NULL,
  `sku` varchar(100) NOT NULL,
  `status` enum('active','inactive') NOT NULL DEFAULT 'active'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `product_images`
--

CREATE TABLE `product_images` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `product_id` bigint(20) UNSIGNED NOT NULL,
  `image_url` varchar(255) NOT NULL,
  `alt_text` varchar(255) NOT NULL,
  `is_primary` tinyint(1) DEFAULT 0,
  `created_at` datetime(3) DEFAULT NULL,
  `updated_at` datetime(3) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `product_images`
--

INSERT INTO `product_images` (`id`, `product_id`, `image_url`, `alt_text`, `is_primary`, `created_at`, `updated_at`) VALUES
(1, 1, 'product/1_1739549135.jpg', '242', 0, '2025-02-14 09:19:55.618', '2025-02-14 16:05:35.980'),
(3, 1, 'product/1_1739525355.jpg', 'qwe', 1, '2025-02-14 09:29:15.426', '2025-02-14 09:29:15.426'),
(4, 1, 'product/1_1739549355.png', '242', 0, '2025-02-14 16:09:15.642', '2025-02-14 16:09:15.642');

-- --------------------------------------------------------

--
-- Table structure for table `product_reviews`
--

CREATE TABLE `product_reviews` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `product_id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `rating` bigint(20) NOT NULL,
  `review` text DEFAULT NULL,
  `created_at` datetime(3) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `product_reviews`
--

INSERT INTO `product_reviews` (`id`, `product_id`, `user_id`, `rating`, `review`, `created_at`) VALUES
(1, 1, 1, 4, 'Great product!', '2025-02-04 07:58:08.672');

-- --------------------------------------------------------

--
-- Table structure for table `product_variants`
--

CREATE TABLE `product_variants` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `product_id` bigint(20) UNSIGNED NOT NULL,
  `attribute_name` varchar(100) NOT NULL,
  `attribute_value` varchar(100) NOT NULL,
  `additional_price` decimal(10,2) DEFAULT 0.00,
  `created_at` datetime(3) DEFAULT NULL,
  `updated_at` datetime(3) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `product_variants`
--

INSERT INTO `product_variants` (`id`, `product_id`, `attribute_name`, `attribute_value`, `additional_price`, `created_at`, `updated_at`) VALUES
(1, 1, 'Color', 'Red', '10.00', '2025-02-04 08:46:06.181', '2025-02-04 08:46:06.181'),
(2, 1, 'Color', 'Red', '10.00', '2025-02-04 08:49:53.108', '2025-02-04 08:49:53.108');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uni_categories_slug` (`slug`),
  ADD KEY `idx_categories_parent_id` (`parent_id`);

--
-- Indexes for table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uni_products_slug` (`slug`),
  ADD UNIQUE KEY `uni_products_sku` (`sku`),
  ADD KEY `idx_products_category_id` (`category_id`);

--
-- Indexes for table `product_images`
--
ALTER TABLE `product_images`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_product_images_product_id` (`product_id`);

--
-- Indexes for table `product_reviews`
--
ALTER TABLE `product_reviews`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_product_reviews_product_id` (`product_id`),
  ADD KEY `idx_product_reviews_user_id` (`user_id`);

--
-- Indexes for table `product_variants`
--
ALTER TABLE `product_variants`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_product_variants_product_id` (`product_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `categories`
--
ALTER TABLE `categories`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=34;

--
-- AUTO_INCREMENT for table `products`
--
ALTER TABLE `products`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `product_images`
--
ALTER TABLE `product_images`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `product_reviews`
--
ALTER TABLE `product_reviews`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `product_variants`
--
ALTER TABLE `product_variants`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
