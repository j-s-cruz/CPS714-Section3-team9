import React from "react";

type Difficulty = "Beginner" | "Intermediate" | "Advanced";
type PremiumStatus = "Basic" | "Premium" | "VIP";

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
  Mindfulless: "/images/mindfulless.png",
};

export interface CardProps {
  className: string;
  scheduledDate?: Date;
  timeFrom: string;
  timeTo: string;
  duration: number;
  trainer: string;
  difficulty: Difficulty;
  seatsLeft: number;
  type: string;
  premiumStatus: PremiumStatus;
}

export const Card: React.FC<CardProps> = ({
  className,
  scheduledDate = new Date(),
  timeFrom,
  timeTo,
  duration,
  trainer,
  difficulty,
  seatsLeft,
  type,
}) => {

  // Format date as "Mon, Jan 1"
  const formattedDate = scheduledDate.toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
  });

  const difficultyColor = (difficulty: Difficulty) => {
    switch (difficulty) {
      case "Beginner":
        return "text-success";
      case "Intermediate":
        return "text-warning";
      case "Advanced":
        return "text-danger";
      default:
        return "text-dark";
    }
  }

  const seatsLeftColor = (seatsLeft : number) => {
    if (seatsLeft === 0) {
      return "text-danger"
    } else if (seatsLeft <= 3) {
      return "text-warning"
    } else {
      return "text-success"
    }
  }
  
  return (
    <div className="card mb-4 shadow-sm" style={{ backgroundColor: "#FFFFFF", borderRadius: "10px", overflow: "hidden", display: "flex", flexDirection: "column", justifyContent: "space-between", width: "calc(33.333% - 60px)", margin: "10px" }}>
      <p>dshdajdsljdlajdlajdla</p>
          <img src={classImages[type] || "/images/default.png"} alt={type} className="w-100" style={{ height: "150px", objectFit: "cover" }} />
          <div>
          <h2 className="text-lg font-semibold text-slate-900">{className}</h2>
          <p className="text-sm text-slate-500">{type}</p>
        </div>
    </div>
  );
};