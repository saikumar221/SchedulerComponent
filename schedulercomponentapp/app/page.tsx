"use client";

import styles from "./page.module.css";
import CalendarPage from "./components/Calendar/Calendar";

export default function SchedulesPage() {
  return (
    <div className={styles.container}>
      <div className={styles.leftPanel}>{/* Menu goes here */}</div>
      <div className={styles.rightPanel}>
        <div className={styles.topBar}></div>
        <div className={styles.content}>
          <div className={styles.heading}>Scheduled Suites</div>
          <CalendarPage />
        </div>
      </div>
    </div>
  );
}
