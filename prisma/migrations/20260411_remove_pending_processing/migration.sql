-- Create new enum without pending and processing
CREATE TYPE "OrderStatus_new" AS ENUM ('success', 'failed');

-- Update the column to use the new enum type with the default handled
ALTER TABLE "Order" ALTER COLUMN status DROP DEFAULT;

-- Update any existing records with pending/processing to failed
UPDATE "Order" SET status = 'failed'::"OrderStatus" WHERE status = 'pending'::"OrderStatus" OR status = 'processing'::"OrderStatus";

-- Alter the column type
ALTER TABLE "Order" ALTER COLUMN status TYPE "OrderStatus_new" USING status::text::"OrderStatus_new";

-- Drop the old enum type
DROP TYPE "OrderStatus";

-- Rename the new enum to the original name
ALTER TYPE "OrderStatus_new" RENAME TO "OrderStatus";

-- Set the default value
ALTER TABLE "Order" ALTER COLUMN status SET DEFAULT 'failed'::"OrderStatus";
