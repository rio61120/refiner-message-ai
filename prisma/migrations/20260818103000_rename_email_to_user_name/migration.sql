ALTER TABLE "users" RENAME COLUMN "email" TO "user_name";
ALTER INDEX "users_email_key" RENAME TO "users_user_name_key";
