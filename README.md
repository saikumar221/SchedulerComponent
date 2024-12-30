# SchedulerComponent  

### Database Design  

#### Requirements:  
- Database Setup:
  - Use Supabase for hosting tables.  

- Data to Store:
  - Test Suite Details:  
    - Name of the test suite.  
  - Schedules: 
    - Start date and time for test execution.  
    - Recurrence patterns, including weekly and custom intervals.  
  - Execution Logs: 
    - Historical records of executed tests.  

- Design Principles:  
  - Store all timestamps in UTC for uniformity and compatibility.  
  - Design the schema to scale for future user-level changes.  
  - Ensure schedules can be efficiently queried and managed.  
  - Write an RPC function which will retrieve test schedules in a span of a week.

---

### Assumptions:  
- A test suite can have multiple schedules.  
- The platform is currently single-user.  
- The number of schedules is moderate, leveraging caching to mitigate performance concerns.  
- Recurrence patterns are simple and do not require complex logic.  
- Each test run is expected to last 30 minutes.  
- Recurrence patterns do not include an end date, meaning recursive events will run indefinitely unless manually updated.  

---

## Table Structure

```sql
CREATE TABLE TestSuites (
    suiteID SERIAL PRIMARY KEY,
    suiteName VARCHAR(255) NOT NULL,
    createDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    createdBy INT NOT NULL
    -- FOREIGN KEY (created_by) REFERENCES Users(UserID) ON DELETE CASCADE
);

CREATE TABLE Schedules (
    scheduleID SERIAL PRIMARY KEY,
    suiteID INT NOT NULL,
    startDate DATE NOT NULL,
    startTime TIME NOT NULL,
    endDate DATE DEFAULT NULL,
    endTime TIME DEFAULT NULL, 
    status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'paused', 'cancelled')),
    frequency VARCHAR(20) CHECK (frequency IN ('Daily', 'Weekly', 'Custom')),
    customInterval INT DEFAULT NULL,
    createDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updateDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    daysOfWeek INT[] DEFAULT NULL,
    FOREIGN KEY (suiteID) REFERENCES TestSuites(suiteID) ON DELETE CASCADE
);

CREATE TABLE TestLogs (
    executionID BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    scheduleID BIGINT NOT NULL,
    executeDate TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    status TEXT DEFAULT 'pending' CHECK (status IN ('success', 'failure', 'pending')),
    FOREIGN KEY (scheduleID) REFERENCES Schedules(scheduleID) ON DELETE CASCADE
);
```

--- 
