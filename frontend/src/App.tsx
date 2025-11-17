import { useState } from "react";
import "./App.css";
import { Card } from "./components/card";
import ClassFilter from "./components/Filter";

function App() {
  const [filters, setFilters] = useState({
    date: "",
    timeRange: "",
  });

  const handleFilterChange = (newFilters: {
    date: string;
    timeRange: string;
  }) => {
    console.log("Updated filters:", newFilters);
    setFilters(newFilters);
  };
  return (
    <>
      <ClassFilter onFilterChange={handleFilterChange} />
      <Card
        className="Morning Power Yoga"
        time="6:30 AM"
        duration={60}
        trainer="Alex Johnson"
        difficulty="Intermediate"
        seatsLeft={2}
        type="Yoga"
        buttonValue="CANCEL"
      />
      <Card
        className="Morning Mindfullness"
        time="7:30 AM"
        duration={30}
        trainer="Justin Bieber"
        difficulty="Beginner"
        seatsLeft={5}
        type="Mindfullness"
      />
      <Card
        className="Aquatics"
        time="7:30 AM"
        duration={30}
        trainer="Justin Bieber"
        difficulty="Beginner"
        seatsLeft={0}
        type="Water"
        buttonValue="FULL"
      />
    </>
  );
}

export default App;
