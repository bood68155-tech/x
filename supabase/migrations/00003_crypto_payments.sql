-- ============================================================
-- Extend orders table with crypto-payment columns
-- for the USDT (TRC-20) checkout flow.
-- Run this SQL in the Supabase SQL Editor:
-- https://supabase.com/dashboard/project/_/sql/new
-- ============================================================

-- 1. Add columns used by the CryptoPaymentCheckout component
--    (items, total, payment_method, transaction_id are new;
--     status is already present but we widen the default)

ALTER TABLE orders
  ADD COLUMN IF NOT EXISTS items            JSONB   NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS total            NUMERIC NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS payment_method   TEXT    NOT NULL DEFAULT 'contact',
  ADD COLUMN IF NOT EXISTS transaction_id   TEXT    NOT NULL DEFAULT '';

-- 2. Backfill existing rows so they look like contact-checkout orders
UPDATE orders
   SET payment_method = 'contact'
 WHERE payment_method = 'contact';          -- already the default, but explicit

-- 3. Index for quickly filtering by payment method / status combos
CREATE INDEX IF NOT EXISTS idx_orders_payment_method ON orders (payment_method);
CREATE INDEX IF NOT EXISTS idx_orders_status          ON orders (status);

-- 4. (Optional) allow anonymous users to update their own order
--    This lets a customer who just submitted a crypto order update
--    the transaction_id before verification completes.
--    For now we keep the existing permissive policies.

-- 5. Comment the new columns for Supabase dashboard clarity
COMMENT ON COLUMN orders.items          IS 'JSON array of purchased items (id, title, price, qty)';
COMMENT ON COLUMN orders.total          IS 'Order total as a numeric value (no currency symbol)';
COMMENT ON COLUMN orders.payment_method IS 'Checkout channel: contact | USDT_TRC20';
COMMENT ON COLUMN orders.transaction_id IS 'Blockchain TxID submitted by the buyer (crypto orders only)';
