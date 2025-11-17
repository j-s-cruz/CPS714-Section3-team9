import React, { type ChangeEvent } from "react";

type FilterProps = {
  onFilterChange: (filters: { date: string; timeRange: string }) => void;
};

type FilterState = {
  date: string;
  timeRange: string;
};

export default class ClassFilter extends React.Component<
  FilterProps,
  FilterState
> {
  constructor(props: FilterProps) {
    super(props);

    this.state = {
      date: "",
      timeRange: "",
    };
  }

  handleDateChange = (e: ChangeEvent<HTMLInputElement>) => {
    this.setState({ date: e.target.value }, () => {
      this.props.onFilterChange(this.state);
    });
  };

  handleTimeChange = (e: ChangeEvent<HTMLSelectElement>) => {
    this.setState({ timeRange: e.target.value }, () => {
      this.props.onFilterChange(this.state);
    });
  };

  render() {
    return (
      <div className="filter-bar" style={{ display: "flex", gap: "1rem" }}>
        <div>
          <label>Date: </label>
          <input
            type="date"
            value={this.state.date}
            onChange={this.handleDateChange}
          />
        </div>

        <div>
          <label>Time: </label>
          <select value={this.state.timeRange} onChange={this.handleTimeChange}>
            <option value="">All</option>
            <option value="morning">Morning (6–12)</option>
            <option value="afternoon">Afternoon (12–18)</option>
            <option value="evening">Evening (18–22)</option>
          </select>
        </div>
      </div>
    );
  }
}
