import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./styles.css";

type FilterProps = {
  onFilterChange: (filters: {
    date: string | null;
    timeRange: string | null;
  }) => void;
};

export default function ClassFilter({ onFilterChange }: FilterProps) {
  const [date, setDate] = useState<Date | null>(null);
  const [timeRange, setTimeRange] = useState<string | null>(null);

  function handleSearch() {
    onFilterChange({
      date: date ? date.toISOString().split("T")[0] : null,
      timeRange,
    });
  }
  function handleClear() {
    setDate(null);
    setTimeRange(null);
    onFilterChange({ date: null, timeRange: null });
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <div className="bg-white shadow rounded-full px-4 h-14 flex items-center gap-4">
        <div className="flex-1 min-w-0 flex items-center gap-4">
          <div className="flex items-center gap-3 border-r pr-4">
            <div className="w-9 h-9 flex items-center justify-center rounded-md">
              <svg
                className="w-5 h-5 text-gray-500"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden
              >
                <path
                  d="M8 7V3M16 7V3M3 11h18M5 21h14a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            <div className="min-w-0">
              <DatePicker
                selected={date}
                onChange={(d: Date | null) => setDate(d)}
                minDate={new Date()}
                placeholderText="Any date"
                isClearable
                dateFormat="MMM d, yyyy"
                className="w-44 bg-transparent focus:outline-none text-sm leading-tight"
                popperClassName="react-datepicker-popper"
              />
            </div>
          </div>

          {/* time selector */}
          <div className="flex items-center gap-2">
            <div className="w-6 text-center">
              <svg
                className="w-5 h-5 text-gray-500"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden
              >
                <path
                  d="M12 8v4l3 3"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            <div>
              <select
                aria-label="Time of day"
                value={timeRange ?? ""}
                onChange={(e) => setTimeRange(e.target.value || null)}
                className="bg-transparent focus:outline-none text-sm"
              >
                <option value="" className="text-gray-100">
                  Any time
                </option>
                <option value="morning">Morning (6–12)</option>
                <option value="afternoon">Afternoon (12–18)</option>
                <option value="night">Night (18–22)</option>
              </select>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 ml-auto">
          <button
            type="button"
            onClick={handleClear}
            className="text-sm px-3 py-2 rounded-md hover:bg-gray-100"
            aria-label="Clear filters"
          >
            Clear
          </button>
          <button
            type="button"
            onClick={handleSearch}
            className="bg-black text-white px-4 py-2 rounded-full text-sm shadow"
            aria-label="Search"
          >
            Search
          </button>
        </div>
      </div>
    </div>
  );
}
