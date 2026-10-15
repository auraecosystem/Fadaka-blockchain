CREATE OR REPLACE FUNCTION process_store_transaction(
    p_username TEXT, 
    p_email TEXT, 
    p_target_store_id INT,
    p_discount_divisor NUMERIC
)
RETURNS TABLE (
    status_message TEXT,
    calculated_revenue NUMERIC,
    discounted_metric NUMERIC
) AS $$
DECLARE
    row_record RECORD;
    v_total_sales NUMERIC := 0.00;
    v_metric_result NUMERIC := 0.00;
    v_status TEXT;
BEGIN
    -- 1. ERROR HANDLING & INSERT LOGIC
    BEGIN
        INSERT INTO users (username, email) 
        VALUES (p_username, p_email);
        v_status := 'User registered and transaction processed.';
    EXCEPTION
        WHEN unique_violation THEN
            v_status := 'Existing user logged. Transaction processed.';
    END;

    -- 2. LOOP & QUERY INTEGRATION
    FOR row_record IN 
        SELECT price, quantity 
        FROM order_items 
        WHERE store_id = p_target_store_id 
    LOOP
        v_total_sales := v_total_sales + (row_record.price * row_record.quantity);
    END LOOP;

    -- 3. CONDITIONAL DIVIDE LOGIC
    IF p_discount_divisor = 0 THEN
        v_metric_result := 0;
    ELSE
        v_metric_result := v_total_sales / p_discount_divisor;
    END IF;

    -- RETURN COMBINED RESULTS
    RETURN QUERY SELECT v_status, v_total_sales, v_metric_result;
END;
$$ LANGUAGE plpgsql;
