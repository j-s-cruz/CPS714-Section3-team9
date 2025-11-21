import React from "react";
import { useState } from "react";


// Mapping of class types to their corresponding image paths
const classImages: Record<string, string> = {
  yoga: "/images/yoga.png",
  cardio: "/images/cardio.png",
  pilates: "/images/pilates.png",
  cycling: "/images/cycling.png",
  dance: "/images/dance.png",
  strength: "/images/strength.png",
  flexibility: "/images/flexibility.png",
  combat: "/images/combat.png",
  personal: "/images/personal.png",
  barre: "/images/barre.png",
  water: "/images/water.png",
  mindfulness: "/images/mindfullness.png",
};

// Define the props for the Card component
export interface CardProps {
  className: string;
  scheduledDate?: Date;
  time: string;
  duration: string;
  trainer: string;
  difficulty: string;
  seatsLeft: number;
  type: string;
  description?: string;
  buttonValue?: string;
  premium_status?: string;
}

// Card component to display class information
export const Card: React.FC<CardProps> = ({
  className,
  scheduledDate = new Date(),
  time,
  duration,
  trainer,
  difficulty,
  seatsLeft: initialSeatsLeft, 
  type,
  description,
  buttonValue = "BOOK",
  premium_status = "basic",
}) => {

  const [isBooked, setIsBooked] = useState(buttonValue === "CANCEL");
  const [seatsLeft, setSeatsLeft] = useState(initialSeatsLeft);


  // Handle button click for booking/cancelling - dummy implementation
  const handleButtonClick = () => {
    if (premium_status !== "basic") {
      alert(`This is a ${premium_status} class. Upgrade your membership to book!`);
      return;
    }
    if (!isBooked) {
      setIsBooked(true);
      setSeatsLeft((prev) => prev - 1);
      // setSidebarMessage("Successfully booked!");
      // setShowSidebar(true);
    } else {
      setIsBooked(false);
      setSeatsLeft((prev) => prev + 1);
      // setSidebarMessage("Booking cancelled!");
      // setShowSidebar(true);
    }
    // setTimeout(() => setShowSidebar(false), 3000);
  };

    
  // Formats the date into a more readable format
  const formattedDate = scheduledDate.toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
  });

  // Formats time from "HH:MM:SS" format to "HH:MM AM/PM" format
  function formatedTime(time: string): string {
    const [hour, minute] = time.split(":").map(Number);

    // Select AM or PM
    let timeOfDay: string;

    if (hour < 12) {
      timeOfDay = "AM";
    } else {
      timeOfDay = "PM";
    }

    // Covert 24 hour clock to 12 hour clock
    let formatted12HourClock: number;

    if (hour % 12 === 0) {
      formatted12HourClock = 12;
    } else {
      formatted12HourClock = hour % 12;
    }

    return `${formatted12HourClock}:${minute.toString().padStart(2, "0")} ${timeOfDay}`;
  } 

  // Converts duration from "HH:MM:SS" format to total minutes
  function formattedDuration(duration: string): number {
      const [hours, minutes, _] = duration.split(":").map(Number);
      return hours * 60 + minutes;
  }

  

  // Determines the color based on the number of seats left
  const seatsLeftColor = (seatsLeft: number) => {
    if (seatsLeft === 0) {
      return "text-dark";
    } else if (seatsLeft <= 3) {
      return "text-danger";
    } else {
      return "text-success";
    }
  };

  // Determines the button style based on its value (for example: BOOK, CANCEL, FULL)
  const buttonStatus = (buttonValue: string) => {
    if (buttonValue === "CANCEL") {
      return (
        <div
          className="btn-group btn-sm rounded-5 overflow-hidden"
          role="group"
        >
          {" "}
          <button
            type="button"
            className="btn btn-dark px-3"
            style={{ fontSize: "13px" }}
          >
            BOOKED
          </button>{" "}
          <button
            type="button"
            className="btn btn-danger px-3"
            style={{ fontSize: "13px" }}
          >
            CANCEL
          </button>
        </div>
      );
    } else if (buttonValue === "FULL") {
      return (
        <button
          className="btn btn-secondary btn-sm rounded-5 px-3"
          style={{ fontSize: "13px" }}
        >
          FULL
        </button>
      );
    } else {
      return (
        <button
          className="btn btn-success btn-sm rounded-5 px-3"
          style={{ fontSize: "13px" }}
        >
          BOOK
        </button>
      );
    }
  };

  return (
    <div className="card shadow-sm rounded-4 p-3">
      {/* Class Image & Level Section */}
      <section className="mb-3">
        <div className="d-flex justify-content-between mb-2">
          {/* Premium Status */}
          <div
            className="d-flex align-items-center bg-white rounded-4 px-3 py-1 shadow-sm"
            style={{ gap: "6px" }}
          >
          <i
          className={`bi ${
            premium_status === "basic"
              ? "bi-star"       // empty star
              : premium_status === "premium"
              ? "bi-star-half"  // half star
              : "bi-star-fill"  // full star for VIP
          }`}
          style={{
            color:
              premium_status === "basic"
                ? "#aaa"       // grey for basic
                : premium_status === "premium"
                ? "#ffc107"    // yellow for premium
                : "#ff8c00",   // orange for VIP
            fontSize: "16px",
          }}
          ></i>
            <span
              style={{
                fontSize: "11px",
                fontWeight: 500,
                color: "#000",
              }}
            >
              {premium_status}
            </span>
          </div>

          {/* Difficulty */}
          <div
            className="d-flex align-items-center bg-white rounded-4 px-3 py-1 shadow-sm"
            style={{ gap: "6px" }}
          >
            <i
              className="bi bi-circle-fill"
              style={{
                color:
                  difficulty === "beginner"
                    ? "#28a745" // bright green
                    : difficulty === "intermediate"
                    ? "#ffc107" // bright yellow
                    : "#dc3545", // bright red
                fontSize: "14px",
              }}
            ></i>
            <span
              style={{
                fontSize: "11px",
                fontWeight: 500,
                color: "#000",
              }}
            >
              {difficulty}
            </span>
          </div>
        </div>

        {/* Class Image */}
        <img src={classImages[type]} alt={type} className="img-fluid" />
      </section>

      {/* Class Title Section */}
      <section className="d-flex justify-content-between align-items-center flex-wrap mb-2">
        <h1 className="fs-6"><b>{className}</b></h1>
      </section>

      {/* Date, Time, and Duration Section */}
      <section>
        <hr className="mt-1 mb-1" />
        <span
          className="d-flex justify-content-center align-items-center flex-wrap"
          style={{ fontSize: "11px" }}
        >
          <i className="bi-clock me-2"></i>
          <span className="me-2">{formattedDate}</span>
          <span className="me-2">|</span>
          <span className="me-2">{formatedTime(time)}</span>
          <span className="me-2">|</span>
          <span>{formattedDuration(duration)} mins</span>
        </span>
        <hr className="mt-1 mb-2" />
      </section>

      {/* Trainer and Description Section */}
      <section className="mt-2 mb-2">
        <p className="mb-0" style={{ fontSize: "13px" }}>
          <b>Trainer:</b> {trainer}
        </p>
        <p style={{ fontSize: "13px" }}>
          <b>Details:</b> {description}
        </p>
      </section>

      {/* Seats Left and Action Button Section */}
      <section className="d-flex justify-content-between align-items-center mb-1 mt-2">
        <span className="d-block">
          <p
            className={`${seatsLeftColor(seatsLeft)} mb-1`}
            style={{ fontSize: "14px" }}
          >
            {seatsLeft} seats left
          </p>
          <hr className="my-1 mx-0" />
        </span>
        {/* {buttonStatus(buttonValue)} */}
        {/* <button
          className={`btn btn-${isBooked ? "danger" : "success"} btn-sm rounded-5 px-3`}
          style={{ fontSize: "13px" }}
          onClick={handleButtonClick}
        >
          {isBooked ? "CANCEL" : "BOOK"}
        </button> */}

      <button
        className={`btn btn-${isBooked ? "danger" : "success"} btn-sm rounded-5 px-3`}
        style={{ fontSize: "13px" }}
        onClick={handleButtonClick}
        disabled={premium_status !== "basic" && !isBooked} >
        {isBooked ? "CANCEL" : "BOOK"}
      </button>

      </section>
    </div>
  );
};