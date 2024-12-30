CREATE OR REPLACE FUNCTION fetch_weekly_schedules(start_date DATE, end_date DATE)
RETURNS TABLE (
    groupID INT,
    title VARCHAR(255),
    startRecur DATE,
    endRecur DATE,
    daysOfWeek INT[],
    startTime TIME,
    endTime TIME,
    status VARCHAR(20),
    frequency VARCHAR(20),
    customInterval INT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        s.scheduleID AS groupID,
        ts.suiteName AS title,
        s.startDate AS startRecur,
        s.endDate AS endRecur,
        s.daysOfWeek,
        s.startTime,
        s.endTime,
        s.status,
        s.frequency,
        s.customInterval 
    FROM 
        Schedules s
    JOIN 
        TestSuites ts ON s.suiteID = ts.suiteID
    WHERE 
        (
            -- Non-recurring events within the given date range
            s.daysofweek IS NULL AND s.customInterval IS NULL AND
            s.startDate >= start_date AND s.startDate <= end_date
        )
        OR
        (
            -- Daily or custom recurring events
            s.startDate <= end_date AND (s.endDate IS NULL OR s.endDate <= end_date) AND
            (s.daysofweek IS NOT NULL OR s.customInterval IS NOT NULL)
        )
    ORDER BY 
        s.startDate;
END;
$$
 LANGUAGE plpgsql;

GRANT EXECUTE ON FUNCTION public.fetch_weekly_schedules(start_date DATE, end_date DATE) TO anon, service_role;
