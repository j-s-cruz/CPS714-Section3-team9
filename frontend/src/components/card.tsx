import React from "react";

// Define the possible difficulty levels as a TypeScript type
type Difficulty = "Beginner" | "Intermediate" | "Advanced";

// Mapping of class types to their corresponding image paths
const classImages: Record<string, string> = {
  Yoga: "/images/yoga.png",
  Cardio: "/images/cardio.png",
  Pilates: "/images/pilates.png",
  Cycling: "/images/cycling.png",
  Dance: "/images/dance.png",
  Strength: "/images/strength.png",
  Flexibility: "/images/flexibility.png",
  Combat: "/images/combat.png",
  Personal: "/images/personal.png",
  Barre: "/images/barre.png",
  Water: "/images/water.png",
  Mindfullness: "/images/mindfullness.png",
};

// Define the props for the Card component
export interface CardProps {
  className: string;
  scheduledDate?: Date;
  time: string;
  duration: number;
  trainer: string;
  difficulty: Difficulty;
  seatsLeft: number;
  type: string;
  buttonValue?: string;
}

// Card component to display class information
export const Card: React.FC<CardProps> = ({
  className,
  scheduledDate = new Date(),
  time,
  duration,
  trainer,
  difficulty,
  seatsLeft,
  type,
  buttonValue = "BOOK",
}) => {
  // Formats the date into a more readable format
  const formattedDate = scheduledDate.toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
  });

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
    <div
      className="card shadow-sm rounded-4 p-3 m-5"
      style={{ width: "25%", minWidth: "250px" }}
    >
      {/* Class Image Section */}
      <section>
        <img src={classImages[type]} alt={type} className="img-fluid mb-4" />
      </section>

      {/* Class Details Section */}
      <section className="d-flex justify-content-between align-items-center flex-wrap mb-2">
        <h1 className="fs-4">{className}</h1>
        <p
          className="bg-secondary text-white px-1 mb-2"
          style={{ fontSize: "10px" }}
        >
          {difficulty}
        </p>
      </section>

      {/* Trainier and Class Decription Section */}
      <section>
        <hr className="mt-1 mb-1" />
        <span
          className="d-flex justify-content-center align-items-center flex-wrap"
          style={{ fontSize: "14px" }}
        >
          <i className="bi-clock me-2"></i>
          <span className="me-2">{formattedDate}</span>
          <span className="me-2">|</span>
          <span className="me-2">{time}</span>
          <span className="me-2">|</span>
          <span>{duration} mins</span>
        </span>
        <hr className="mt-1 mb-2" />
      </section>

      {/* Trainer and Description Section */}
      <section className="mt-2 mb-2">
        <p className="mb-0" style={{ fontSize: "13px" }}>
          <b>Trainer:</b> {trainer}
        </p>
        <p style={{ fontSize: "13px" }}>
          <b>Details:</b> Lorem Ipsum has been the industry's standard dummy
          text ever since the 1500s, when an unknown printer took a galley of
          type and scrambled it to make a type specimen book.
        </p>
      </section>

      {/* Seats Left and Action Button Section */}
      <section className="d-flex justify-content-between align-items-center mb-1">
        <span className="d-block">
          <p
            className={`${seatsLeftColor(seatsLeft)} mb-1`}
            style={{ fontSize: "14px" }}
          >
            {seatsLeft} seats left
          </p>
          <hr className="my-1 mx-0" />
        </span>
        {buttonStatus(buttonValue)}
      </section>
    </div>
  );
};
