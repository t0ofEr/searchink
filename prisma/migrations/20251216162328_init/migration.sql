-- CreateEnum
CREATE TYPE "GenderEnum" AS ENUM ('MALE', 'FEMALE');

-- CreateEnum
CREATE TYPE "ProjectStatusEnum" AS ENUM ('DRAFT', 'PUBLISHED', 'OPEN', 'ASSIGNED', 'SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "ScheduleOfferStatus" AS ENUM ('ACCEPTED', 'REJECTED', 'PENDING', 'CANCELLED');

-- CreateEnum
CREATE TYPE "ReservationChangeRequestStatus" AS ENUM ('ACCEPTED', 'REJECTED', 'PENDING', 'CANCELLED');

-- CreateEnum
CREATE TYPE "AuthProvider" AS ENUM ('LOCAL', 'GOOGLE');

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "name" VARCHAR(100),
    "lastname" VARCHAR(100),
    "email" VARCHAR(150) NOT NULL,
    "phone_number" VARCHAR(20),
    "birthday_date" TIMESTAMP(3),
    "is_minor" BOOLEAN,
    "avatar_url" VARCHAR(500),
    "gender" "GenderEnum",
    "instagram_url" VARCHAR(500),
    "facebook_url" VARCHAR(500),
    "twitter_url" VARCHAR(500),
    "has_membership" BOOLEAN NOT NULL DEFAULT false,
    "membership_start_date" TIMESTAMP(3),
    "membership_end_date" TIMESTAMP(3),
    "active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modified_at" TIMESTAMP(3) NOT NULL,
    "user_type_id" INTEGER NOT NULL,
    "created_by" INTEGER NOT NULL,
    "modified_by" INTEGER NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuthIdentity" (
    "id" SERIAL NOT NULL,
    "provider" "AuthProvider" NOT NULL,
    "provider_id" TEXT NOT NULL,
    "password" TEXT,
    "user_id" INTEGER NOT NULL,

    CONSTRAINT "AuthIdentity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ParentalConsent" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "guardian_name" TEXT NOT NULL,
    "guardian_rut" TEXT NOT NULL,
    "guardian_phone" TEXT NOT NULL,
    "consent_signed_at" TIMESTAMP(3) NOT NULL,
    "document_url" TEXT,

    CONSTRAINT "ParentalConsent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_types" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_types_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_addresses" (
    "id" SERIAL NOT NULL,
    "address_line_1" TEXT NOT NULL,
    "address_line_2" TEXT,
    "postal_code" VARCHAR(20),
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "is_primary" BOOLEAN NOT NULL DEFAULT false,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modified_at" TIMESTAMP(3),
    "municipality_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "created_by" INTEGER NOT NULL,
    "modified_by" INTEGER,

    CONSTRAINT "user_addresses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "municipalities" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(150) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modified_at" TIMESTAMP(3),
    "region_id" INTEGER NOT NULL,

    CONSTRAINT "municipalities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "regions" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(150) NOT NULL,
    "abbreviation" VARCHAR(20) NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modified_at" TIMESTAMP(3),
    "country_id" INTEGER NOT NULL,

    CONSTRAINT "regions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "countries" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(150) NOT NULL,
    "iso2" CHAR(2) NOT NULL,
    "iso3" CHAR(3) NOT NULL,
    "phone_code" VARCHAR(10),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modified_at" TIMESTAMP(3),

    CONSTRAINT "countries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_roles" (
    "id" SERIAL NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modified_at" TIMESTAMP(3),
    "user_id" INTEGER NOT NULL,
    "role_id" INTEGER NOT NULL,
    "created_by" INTEGER NOT NULL,

    CONSTRAINT "user_roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "roles" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "description" VARCHAR(500),
    "active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modified_at" TIMESTAMP(3),
    "created_by" INTEGER NOT NULL,
    "modified_by" INTEGER,

    CONSTRAINT "roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_follows" (
    "id" SERIAL NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modified_at" TIMESTAMP(3),
    "follower_id" INTEGER NOT NULL,
    "followed_id" INTEGER NOT NULL,

    CONSTRAINT "user_follows_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "projects" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "description" VARCHAR(500),
    "height" DOUBLE PRECISION,
    "width" DOUBLE PRECISION,
    "price" DOUBLE PRECISION,
    "projectStatus" "ProjectStatusEnum" NOT NULL DEFAULT 'DRAFT',
    "gender" "GenderEnum",
    "active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modified_at" TIMESTAMP(3),
    "body_part_id" INTEGER,
    "tattoo_style_id" INTEGER,
    "created_by" INTEGER NOT NULL,
    "modified_by" INTEGER,

    CONSTRAINT "projects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "body_parts" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "description" VARCHAR(255),
    "active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modified_at" TIMESTAMP(3),
    "body_part_category_id" INTEGER NOT NULL,
    "created_by" INTEGER NOT NULL,
    "modified_by" INTEGER NOT NULL,

    CONSTRAINT "body_parts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "body_part_categories" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modified_at" TIMESTAMP(3),
    "created_by" INTEGER NOT NULL,
    "modified_by" INTEGER NOT NULL,

    CONSTRAINT "body_part_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tattoo_styles" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "description" VARCHAR(255),
    "active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modified_at" TIMESTAMP(3),
    "created_by" INTEGER NOT NULL,
    "modified_by" INTEGER,

    CONSTRAINT "tattoo_styles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "news" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "content" TEXT NOT NULL,
    "published_at" TIMESTAMP(3),
    "active" BOOLEAN NOT NULL DEFAULT true,
    "is_for_artists_only" BOOLEAN NOT NULL DEFAULT false,
    "is_for_staff_only" BOOLEAN NOT NULL DEFAULT false,
    "is_for_members_only" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modified_at" TIMESTAMP(3),
    "created_by" INTEGER NOT NULL,
    "modified_by" INTEGER,

    CONSTRAINT "news_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "comments" (
    "id" SERIAL NOT NULL,
    "comment" TEXT NOT NULL,
    "generic_id" INTEGER NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modified_at" TIMESTAMP(3),
    "content_type_id" INTEGER NOT NULL,
    "created_by" INTEGER NOT NULL,
    "modified_by" INTEGER,

    CONSTRAINT "comments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "content_types" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,

    CONSTRAINT "content_types_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notifications" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "description" TEXT NOT NULL,
    "link_url" VARCHAR(500),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_notifications" (
    "id" SERIAL NOT NULL,
    "seen" BOOLEAN NOT NULL DEFAULT false,
    "seen_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_id" INTEGER NOT NULL,
    "notification_id" INTEGER NOT NULL,

    CONSTRAINT "user_notifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "likes" (
    "id" SERIAL NOT NULL,
    "generic_id" INTEGER NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "content_type_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,

    CONSTRAINT "likes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "media_files" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR(255),
    "description" VARCHAR(500),
    "position" INTEGER,
    "pinned" BOOLEAN NOT NULL DEFAULT false,
    "file_url" VARCHAR(500) NOT NULL,
    "file_type" VARCHAR(100) NOT NULL,
    "generic_id" INTEGER NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modified_at" TIMESTAMP(3),
    "content_type_id" INTEGER NOT NULL,
    "created_by" INTEGER NOT NULL,
    "modified_by" INTEGER,

    CONSTRAINT "media_files_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tattoo_artist_schedules" (
    "id" SERIAL NOT NULL,
    "start_date" TIMESTAMP(3) NOT NULL,
    "end_date" TIMESTAMP(3) NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "available" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modified_at" TIMESTAMP(3),
    "created_by" INTEGER NOT NULL,
    "modified_by" INTEGER,

    CONSTRAINT "tattoo_artist_schedules_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "schedule_offers" (
    "id" SERIAL NOT NULL,
    "scheduleOfferStatus" "ScheduleOfferStatus" NOT NULL DEFAULT 'PENDING',
    "proposed_start_date" TIMESTAMP(3),
    "proposed_end_date" TIMESTAMP(3),
    "description" VARCHAR(2000),
    "proposed_price" DOUBLE PRECISION,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "has_change_requests" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modified_at" TIMESTAMP(3),
    "tattoo_artist_schedule_id" INTEGER NOT NULL,
    "requested_by" INTEGER NOT NULL,
    "requested_to" INTEGER NOT NULL,
    "project_id" INTEGER NOT NULL,
    "created_by" INTEGER NOT NULL,
    "modified_by" INTEGER,

    CONSTRAINT "schedule_offers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reservation_change_requests" (
    "id" SERIAL NOT NULL,
    "old_start_date" TIMESTAMP(3) NOT NULL,
    "old_end_date" TIMESTAMP(3) NOT NULL,
    "new_start_date" TIMESTAMP(3),
    "new_end_date" TIMESTAMP(3),
    "old_price" DOUBLE PRECISION NOT NULL,
    "new_price" DOUBLE PRECISION,
    "reason" VARCHAR(2000),
    "reservationChangeREquestStatus" "ReservationChangeRequestStatus" NOT NULL DEFAULT 'PENDING',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modified_at" TIMESTAMP(3),
    "original_reservation_change_request_id" INTEGER,
    "schedule_offer_id" INTEGER NOT NULL,
    "requested_by" INTEGER NOT NULL,
    "requested_to" INTEGER NOT NULL,
    "old_project_id" INTEGER NOT NULL,
    "new_project_id" INTEGER,
    "created_by" INTEGER NOT NULL,
    "modified_by" INTEGER,

    CONSTRAINT "reservation_change_requests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reservations" (
    "id" SERIAL NOT NULL,
    "final_date" TIMESTAMP(3) NOT NULL,
    "final_price" DOUBLE PRECISION NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "schedule_offer_id" INTEGER NOT NULL,
    "artist_id" INTEGER NOT NULL,
    "reserved_by" INTEGER NOT NULL,
    "final_project_id" INTEGER NOT NULL,
    "reservation_status_id" INTEGER NOT NULL,
    "created_by" INTEGER NOT NULL,

    CONSTRAINT "reservations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reservation_statuses" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "reservation_statuses_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_created_by_idx" ON "users"("created_by");

-- CreateIndex
CREATE INDEX "users_modified_by_idx" ON "users"("modified_by");

-- CreateIndex
CREATE INDEX "AuthIdentity_user_id_idx" ON "AuthIdentity"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "AuthIdentity_provider_provider_id_key" ON "AuthIdentity"("provider", "provider_id");

-- CreateIndex
CREATE UNIQUE INDEX "ParentalConsent_user_id_key" ON "ParentalConsent"("user_id");

-- CreateIndex
CREATE INDEX "user_addresses_user_id_idx" ON "user_addresses"("user_id");

-- CreateIndex
CREATE INDEX "user_addresses_created_by_idx" ON "user_addresses"("created_by");

-- CreateIndex
CREATE INDEX "user_addresses_modified_by_idx" ON "user_addresses"("modified_by");

-- CreateIndex
CREATE INDEX "municipalities_region_id_idx" ON "municipalities"("region_id");

-- CreateIndex
CREATE INDEX "municipalities_name_idx" ON "municipalities"("name");

-- CreateIndex
CREATE UNIQUE INDEX "municipalities_region_id_name_key" ON "municipalities"("region_id", "name");

-- CreateIndex
CREATE INDEX "regions_country_id_idx" ON "regions"("country_id");

-- CreateIndex
CREATE INDEX "regions_name_idx" ON "regions"("name");

-- CreateIndex
CREATE UNIQUE INDEX "regions_country_id_name_key" ON "regions"("country_id", "name");

-- CreateIndex
CREATE INDEX "countries_name_idx" ON "countries"("name");

-- CreateIndex
CREATE INDEX "user_roles_role_id_idx" ON "user_roles"("role_id");

-- CreateIndex
CREATE INDEX "user_roles_user_id_idx" ON "user_roles"("user_id");

-- CreateIndex
CREATE INDEX "user_roles_created_by_idx" ON "user_roles"("created_by");

-- CreateIndex
CREATE UNIQUE INDEX "user_roles_user_id_role_id_key" ON "user_roles"("user_id", "role_id");

-- CreateIndex
CREATE INDEX "roles_created_by_idx" ON "roles"("created_by");

-- CreateIndex
CREATE INDEX "roles_modified_by_idx" ON "roles"("modified_by");

-- CreateIndex
CREATE INDEX "user_follows_follower_id_idx" ON "user_follows"("follower_id");

-- CreateIndex
CREATE INDEX "user_follows_followed_id_idx" ON "user_follows"("followed_id");

-- CreateIndex
CREATE INDEX "projects_body_part_id_idx" ON "projects"("body_part_id");

-- CreateIndex
CREATE INDEX "projects_tattoo_style_id_idx" ON "projects"("tattoo_style_id");

-- CreateIndex
CREATE INDEX "projects_created_by_idx" ON "projects"("created_by");

-- CreateIndex
CREATE INDEX "projects_modified_by_idx" ON "projects"("modified_by");

-- CreateIndex
CREATE UNIQUE INDEX "body_parts_name_key" ON "body_parts"("name");

-- CreateIndex
CREATE INDEX "body_parts_created_by_idx" ON "body_parts"("created_by");

-- CreateIndex
CREATE INDEX "body_parts_modified_by_idx" ON "body_parts"("modified_by");

-- CreateIndex
CREATE UNIQUE INDEX "body_part_categories_name_key" ON "body_part_categories"("name");

-- CreateIndex
CREATE INDEX "body_part_categories_name_idx" ON "body_part_categories"("name");

-- CreateIndex
CREATE INDEX "body_part_categories_created_by_idx" ON "body_part_categories"("created_by");

-- CreateIndex
CREATE INDEX "body_part_categories_modified_by_idx" ON "body_part_categories"("modified_by");

-- CreateIndex
CREATE UNIQUE INDEX "tattoo_styles_name_key" ON "tattoo_styles"("name");

-- CreateIndex
CREATE INDEX "tattoo_styles_created_by_idx" ON "tattoo_styles"("created_by");

-- CreateIndex
CREATE INDEX "tattoo_styles_modified_by_idx" ON "tattoo_styles"("modified_by");

-- CreateIndex
CREATE INDEX "news_created_by_idx" ON "news"("created_by");

-- CreateIndex
CREATE INDEX "news_modified_by_idx" ON "news"("modified_by");

-- CreateIndex
CREATE INDEX "comments_created_by_idx" ON "comments"("created_by");

-- CreateIndex
CREATE INDEX "comments_modified_by_idx" ON "comments"("modified_by");

-- CreateIndex
CREATE INDEX "comments_content_type_id_generic_id_idx" ON "comments"("content_type_id", "generic_id");

-- CreateIndex
CREATE UNIQUE INDEX "content_types_name_key" ON "content_types"("name");

-- CreateIndex
CREATE INDEX "user_notifications_user_id_idx" ON "user_notifications"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "user_notifications_user_id_notification_id_key" ON "user_notifications"("user_id", "notification_id");

-- CreateIndex
CREATE INDEX "likes_content_type_id_generic_id_idx" ON "likes"("content_type_id", "generic_id");

-- CreateIndex
CREATE UNIQUE INDEX "likes_user_id_content_type_id_generic_id_key" ON "likes"("user_id", "content_type_id", "generic_id");

-- CreateIndex
CREATE INDEX "media_files_created_by_idx" ON "media_files"("created_by");

-- CreateIndex
CREATE INDEX "media_files_modified_by_idx" ON "media_files"("modified_by");

-- CreateIndex
CREATE INDEX "media_files_content_type_id_generic_id_idx" ON "media_files"("content_type_id", "generic_id");

-- CreateIndex
CREATE INDEX "tattoo_artist_schedules_created_by_idx" ON "tattoo_artist_schedules"("created_by");

-- CreateIndex
CREATE INDEX "tattoo_artist_schedules_modified_by_idx" ON "tattoo_artist_schedules"("modified_by");

-- CreateIndex
CREATE INDEX "schedule_offers_created_by_idx" ON "schedule_offers"("created_by");

-- CreateIndex
CREATE INDEX "schedule_offers_modified_by_idx" ON "schedule_offers"("modified_by");

-- CreateIndex
CREATE UNIQUE INDEX "schedule_offers_tattoo_artist_schedule_id_requested_by_key" ON "schedule_offers"("tattoo_artist_schedule_id", "requested_by");

-- CreateIndex
CREATE INDEX "reservation_change_requests_requested_by_idx" ON "reservation_change_requests"("requested_by");

-- CreateIndex
CREATE INDEX "reservation_change_requests_created_by_idx" ON "reservation_change_requests"("created_by");

-- CreateIndex
CREATE INDEX "reservation_change_requests_modified_by_idx" ON "reservation_change_requests"("modified_by");

-- CreateIndex
CREATE INDEX "reservations_created_by_idx" ON "reservations"("created_by");

-- CreateIndex
CREATE INDEX "reservations_artist_id_idx" ON "reservations"("artist_id");

-- CreateIndex
CREATE UNIQUE INDEX "reservations_schedule_offer_id_reserved_by_key" ON "reservations"("schedule_offer_id", "reserved_by");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_user_type_id_fkey" FOREIGN KEY ("user_type_id") REFERENCES "user_types"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_modified_by_fkey" FOREIGN KEY ("modified_by") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuthIdentity" ADD CONSTRAINT "AuthIdentity_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ParentalConsent" ADD CONSTRAINT "ParentalConsent_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_addresses" ADD CONSTRAINT "user_addresses_municipality_id_fkey" FOREIGN KEY ("municipality_id") REFERENCES "municipalities"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_addresses" ADD CONSTRAINT "user_addresses_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_addresses" ADD CONSTRAINT "user_addresses_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_addresses" ADD CONSTRAINT "user_addresses_modified_by_fkey" FOREIGN KEY ("modified_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "municipalities" ADD CONSTRAINT "municipalities_region_id_fkey" FOREIGN KEY ("region_id") REFERENCES "regions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "regions" ADD CONSTRAINT "regions_country_id_fkey" FOREIGN KEY ("country_id") REFERENCES "countries"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_roles" ADD CONSTRAINT "user_roles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_roles" ADD CONSTRAINT "user_roles_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_roles" ADD CONSTRAINT "user_roles_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "roles" ADD CONSTRAINT "roles_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "roles" ADD CONSTRAINT "roles_modified_by_fkey" FOREIGN KEY ("modified_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_follows" ADD CONSTRAINT "user_follows_follower_id_fkey" FOREIGN KEY ("follower_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_follows" ADD CONSTRAINT "user_follows_followed_id_fkey" FOREIGN KEY ("followed_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "projects" ADD CONSTRAINT "projects_body_part_id_fkey" FOREIGN KEY ("body_part_id") REFERENCES "body_parts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "projects" ADD CONSTRAINT "projects_tattoo_style_id_fkey" FOREIGN KEY ("tattoo_style_id") REFERENCES "tattoo_styles"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "projects" ADD CONSTRAINT "projects_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "projects" ADD CONSTRAINT "projects_modified_by_fkey" FOREIGN KEY ("modified_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "body_parts" ADD CONSTRAINT "body_parts_body_part_category_id_fkey" FOREIGN KEY ("body_part_category_id") REFERENCES "body_part_categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "body_parts" ADD CONSTRAINT "body_parts_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "body_parts" ADD CONSTRAINT "body_parts_modified_by_fkey" FOREIGN KEY ("modified_by") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "body_part_categories" ADD CONSTRAINT "body_part_categories_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "body_part_categories" ADD CONSTRAINT "body_part_categories_modified_by_fkey" FOREIGN KEY ("modified_by") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tattoo_styles" ADD CONSTRAINT "tattoo_styles_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tattoo_styles" ADD CONSTRAINT "tattoo_styles_modified_by_fkey" FOREIGN KEY ("modified_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "news" ADD CONSTRAINT "news_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "news" ADD CONSTRAINT "news_modified_by_fkey" FOREIGN KEY ("modified_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comments" ADD CONSTRAINT "comments_content_type_id_fkey" FOREIGN KEY ("content_type_id") REFERENCES "content_types"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comments" ADD CONSTRAINT "comments_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comments" ADD CONSTRAINT "comments_modified_by_fkey" FOREIGN KEY ("modified_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_notifications" ADD CONSTRAINT "user_notifications_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_notifications" ADD CONSTRAINT "user_notifications_notification_id_fkey" FOREIGN KEY ("notification_id") REFERENCES "notifications"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "likes" ADD CONSTRAINT "likes_content_type_id_fkey" FOREIGN KEY ("content_type_id") REFERENCES "content_types"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "likes" ADD CONSTRAINT "likes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "media_files" ADD CONSTRAINT "media_files_content_type_id_fkey" FOREIGN KEY ("content_type_id") REFERENCES "content_types"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "media_files" ADD CONSTRAINT "media_files_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "media_files" ADD CONSTRAINT "media_files_modified_by_fkey" FOREIGN KEY ("modified_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tattoo_artist_schedules" ADD CONSTRAINT "tattoo_artist_schedules_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tattoo_artist_schedules" ADD CONSTRAINT "tattoo_artist_schedules_modified_by_fkey" FOREIGN KEY ("modified_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "schedule_offers" ADD CONSTRAINT "schedule_offers_tattoo_artist_schedule_id_fkey" FOREIGN KEY ("tattoo_artist_schedule_id") REFERENCES "tattoo_artist_schedules"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "schedule_offers" ADD CONSTRAINT "schedule_offers_requested_by_fkey" FOREIGN KEY ("requested_by") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "schedule_offers" ADD CONSTRAINT "schedule_offers_requested_to_fkey" FOREIGN KEY ("requested_to") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "schedule_offers" ADD CONSTRAINT "schedule_offers_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "schedule_offers" ADD CONSTRAINT "schedule_offers_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "schedule_offers" ADD CONSTRAINT "schedule_offers_modified_by_fkey" FOREIGN KEY ("modified_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reservation_change_requests" ADD CONSTRAINT "reservation_change_requests_original_reservation_change_re_fkey" FOREIGN KEY ("original_reservation_change_request_id") REFERENCES "reservation_change_requests"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reservation_change_requests" ADD CONSTRAINT "reservation_change_requests_schedule_offer_id_fkey" FOREIGN KEY ("schedule_offer_id") REFERENCES "schedule_offers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reservation_change_requests" ADD CONSTRAINT "reservation_change_requests_requested_by_fkey" FOREIGN KEY ("requested_by") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reservation_change_requests" ADD CONSTRAINT "reservation_change_requests_requested_to_fkey" FOREIGN KEY ("requested_to") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reservation_change_requests" ADD CONSTRAINT "reservation_change_requests_old_project_id_fkey" FOREIGN KEY ("old_project_id") REFERENCES "projects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reservation_change_requests" ADD CONSTRAINT "reservation_change_requests_new_project_id_fkey" FOREIGN KEY ("new_project_id") REFERENCES "projects"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reservation_change_requests" ADD CONSTRAINT "reservation_change_requests_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reservation_change_requests" ADD CONSTRAINT "reservation_change_requests_modified_by_fkey" FOREIGN KEY ("modified_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reservations" ADD CONSTRAINT "reservations_schedule_offer_id_fkey" FOREIGN KEY ("schedule_offer_id") REFERENCES "tattoo_artist_schedules"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reservations" ADD CONSTRAINT "reservations_artist_id_fkey" FOREIGN KEY ("artist_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reservations" ADD CONSTRAINT "reservations_reserved_by_fkey" FOREIGN KEY ("reserved_by") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reservations" ADD CONSTRAINT "reservations_final_project_id_fkey" FOREIGN KEY ("final_project_id") REFERENCES "projects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reservations" ADD CONSTRAINT "reservations_reservation_status_id_fkey" FOREIGN KEY ("reservation_status_id") REFERENCES "reservation_statuses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reservations" ADD CONSTRAINT "reservations_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
