import { DateRange, defaultDateRange } from "@/lib/types";
import { setDateFilter } from "@/store/features/pollSlice";
import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useDispatch } from "react-redux";

export function DateRangeFilter() {
  const [dateRange, setDateRange] = useState<DateRange>(defaultDateRange);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setDateFilter(dateRange));
  }, [dateRange, dispatch]);

  return (
    <div className="flex gap-2 items-center">
      <DatePicker
        selected={new Date(dateRange?.from)}
        onChange={(date) => setDateRange({ from: date!.toISOString(), to: dateRange?.to! })}
        placeholderText="Start date"
      />
      <span>to</span>
      <DatePicker
        selected={new Date(dateRange?.to)}
        onChange={(date) => setDateRange({ from: dateRange?.from!, to: date!.toISOString() })}
        placeholderText="End date"
        minDate={new Date(dateRange?.from)}
      />
    </div>
  );
}

