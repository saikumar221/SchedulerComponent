import Modal from "react-modal";
import "./SchedulerModal.css";
import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Suite } from "@/app/types";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function SchedulerModal({
  modalIsOpen,
  closeModal,
}: {
  modalIsOpen: boolean;
  closeModal: () => void;
}) {
  const customStyles = {
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
      borderRadius: "20px",
      padding: "0",
      width: "640px",
    },
    overlay: {
      background: "#0A0A0A80",
    },
  };

  const [selectedDays, setSelectedDays] = useState<number[]>([]);
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [testSuite, setTestSuite] = useState<number>();
  const [customInterval, setCustomInterval] = useState<string | undefined>(undefined);
  const [suites, setSuites] = useState<Suite[]>([]);

  const days = [0, 1, 2, 3, 4, 5, 6];
  const daysNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/suites`);
        const data = await response.json();
        setSuites(data);
        setTestSuite(data[0]?.suiteid || "");
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleDaySelect = (day: number) => {
    setSelectedDays((prevSelectedDays = []) =>
      prevSelectedDays.includes(day)
        ? prevSelectedDays.filter((d) => d !== day)
        : [...prevSelectedDays, day]
    );
  };

  const handleSave = async () => {
    try {
      const response = await fetch('/api/schedules', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          suiteID: testSuite,
          startDate: startDate.toISOString().split('T')[0],
          startTime: startDate.toISOString().split('T')[1].split('.')[0],
          endDate: null,
          endTime: null,
          status: 'active',
          daysOfWeek: selectedDays,
          customInterval: customInterval,
          frequency: customInterval ? 'Custom' : (selectedDays?.length === 7 ? 'Daily' : 'Weekly'),
        }),
      });

      const data = await response.json();
      closeModal();
      alert('Schedule saved successfully!');
    } catch (error) {
      console.error('Error saving schedule:', error);
      alert(`Schedule saved successfully! ${error}`);
      closeModal();
    }
  };

  return (
    <Modal
      isOpen={modalIsOpen}
      onRequestClose={closeModal}
      style={customStyles}
      ariaHideApp={false}
      contentLabel="Schedule Suite"
    >
      <div className="schedule-detail-modal">
        <div className="modal-header">
          <div className="modal-heading">Schedule Detail</div>
          <button className="close-button" onClick={closeModal}>
            ×
          </button>
        </div>

        <div className="modal-content">
          <div className="form-group">
            <label>Test Suite</label>
            <select
              value={testSuite}
              onChange={(e) => setTestSuite(Number(e.target.value))}
            >
              {suites.map((suite) => (
                <option key={suite.suiteid} value={suite.suiteid}>
                  {suite.suitename}
                </option>
              ))}
            </select>
          </div>

          <div className="form-section">
            <div className="form-group">
              <label>Start Date and Time</label>
              <DatePicker
                selected={startDate}
                onChange={(date) => date && setStartDate(date)}
                timeInputLabel="Time:"
                dateFormat="MM/dd/yyyy h:mm aa z"
                showTimeInput
                showIcon
              />
            </div>

            <div className="form-group">
              <label>Run Weekly on Every</label>
              <div className="days-selector">
                {days.map((day) => (
                  <button
                    key={day}
                    className={`day-button ${selectedDays.includes(day) ? "selected" : ""}`}
                    onClick={() => handleDaySelect(day)}
                  >
                    {daysNames[day]}
                  </button>
                ))}
              </div>
              <a href="#" className="custom-interval">
                Custom Interval
              </a>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button className="cancel-button" onClick={closeModal}>
            × Cancel Schedule
          </button>
          <button className="save-button" onClick={handleSave}>
            Save Changes
          </button>
        </div>
      </div>
    </Modal>
  );
}
