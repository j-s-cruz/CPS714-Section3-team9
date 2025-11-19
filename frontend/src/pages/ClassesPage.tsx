// src/pages/ClassesPage.tsx
import { useCallback, useEffect, useState } from "react";
import { fetchClassSchedules, type ClassSchedule } from "../../api/class";
import ClassFilter from "../components/Filter";
import { Card } from "../components/card";

type FilterFromComponent = {
  date: string | null; // 'yyyy-MM-dd' or null
  timeRange: string | null; // 'morning' | 'afternoon' | 'night' or null
};

export default function ClassesPage() {
  const [schedules, setSchedules] = useState<ClassSchedule[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch function that accepts the exact params our API expects
  const loadSchedules = useCallback(
    async (filters: {
      date?: string;
      time_from?: string;
      time_to?: string;
    }) => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchClassSchedules(
          filters.date,
          filters.time_from,
          filters.time_to
        );
        console.log("API Response:", data);
        setSchedules(data);
      } catch (err: any) {
        console.error(err);
        setError(err?.message ?? "Failed to load schedules");
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // Adapter: convert the ClassFilter's (date, timeRange) into API params
  const handleFilterChange = useCallback(
    (f: FilterFromComponent) => {
      // Map timeRange to time_from/time_to
      let time_from: string | undefined = undefined;
      let time_to: string | undefined = undefined;

      if (f.timeRange === "morning") {
        time_from = "06:00";
        time_to = "12:00";
      } else if (f.timeRange === "afternoon") {
        time_from = "12:00";
        time_to = "18:00";
      } else if (f.timeRange === "night" || f.timeRange === "evening") {
        // Accept either name ('night' from filter or 'evening' if used elsewhere)
        time_from = "18:00";
        time_to = "22:00";
      }

      loadSchedules({
        date: f.date ?? undefined,
        time_from,
        time_to,
      });
    },
    [loadSchedules]
  );

  // initial load: no filters
  useEffect(() => {
    loadSchedules({});
  }, [loadSchedules]);

  return (
    <div className="mt-4 m-5">
      <h3 className="text-xl font-semibold mb-4">Explore Classes</h3>
      <div className="mb-6">
        <ClassFilter onFilterChange={handleFilterChange} />
      </div>

      <div className="mx-auto w-3/4 ml-7 mt-6">
        {loading && <p className="text-gray-500">Loading classes…</p>}
        {error && <p className="text-red-500">{error}</p>}
        {!loading && schedules.length === 0 && <p>No classes found.</p>}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 mt-4">
          {schedules.map((schedule) => {
            const {
              class: classInfo,
              class_id,
              duration,
              scheduled_date,
              taken_spots,
              time_from,
              total_spots,
              trainer,
            } = schedule;
            console.log(scheduled_date);
            return (
              <Card
                key={class_id}
                className={classInfo.class_name}
                scheduledDate={new Date(scheduled_date + "T00:00:00")}
                time={time_from}
                duration={duration}
                trainer={trainer}
                difficulty={classInfo.difficulty}
                seatsLeft={total_spots - taken_spots}
                type={classInfo.type}
                buttonValue="BOOK"
                premium_status={classInfo.premium_status}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
