-- SQL Script to Mask Existing Card Numbers in Database
-- This script updates all existing card numbers to show only the last 4 digits
-- Run this script ONCE to migrate existing data to masked format

-- Backup current data (optional but recommended)
-- CREATE TABLE payment_methods_backup AS SELECT * FROM payment_methods;

-- Update all card numbers to masked format
-- This will replace full card numbers with masked versions showing only last 4 digits
UPDATE payment_methods
SET tarjeta_numero = CONCAT('**** **** **** ', RIGHT(tarjeta_numero, 4))
WHERE tipo = 'tarjeta' 
  AND tarjeta_numero IS NOT NULL 
  AND tarjeta_numero NOT LIKE '*%';  -- Only update if not already masked

-- Verify the update
SELECT id, tipo, tarjeta_numero, tarjeta_titular, es_predeterminado
FROM payment_methods
WHERE tipo = 'tarjeta';

-- Expected output: All card numbers should show as "**** **** **** XXXX"
