// src/api/schedules.ts
export type ClassInfo = {
  class_id: number;
  class_name: string;
  created_at: Date;
  description: string;
  difficulty: string;
  premium_status: string;
  type: string;
};

export type ClassSchedule = {
  class: ClassInfo,
  class_id: number, // schedule_id 
  duration:number;
  scheduled_date: Date;
  taken_spots: number;
  time_from: string;
  time_to: string;
  total_spots: number;
  trainer: string;
};

export async function fetchClassSchedules(
  date?: string,
  time_from?: string,
  time_to?: string
): Promise<ClassSchedule[]> {
  const params = new URLSearchParams();
  if (date) params.append("date", date);
  if (time_from) params.append("time_from", time_from);
  if (time_to) params.append("time_to", time_to);

  const res = await fetch(
    `http://localhost:8000/classes/schedules?${params.toString()}`
  );
  if (!res.ok) throw new Error("Failed to fetch schedules");
  
  // The backend will return JSON; we cast to the correct TS type
  return (await res.json()) as ClassSchedule[];
}
