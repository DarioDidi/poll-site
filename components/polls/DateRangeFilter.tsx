import { DateRange, defaultDateRange } from "@/lib/types";
import { setDateFilter } from "@/store/features/pollSlice";
import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useDispatch } from "react-redux";
import { usePathname, useSearchParams, useRouter } from 'next/navigation';
import { createPageURL } from "./Pagination";

export function DateRangeFilter() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const dispatch = useDispatch();
  const [dateRange, setDateRange] = useState<DateRange>(defaultDateRange);

  useEffect(() => {
    dispatch(setDateFilter(dateRange));
    replace(createPageURL(pathname, searchParams, 1));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dateRange, dispatch]);

  return (
    <div className="flex gap-2 items-center">
      <DatePicker
        selected={new Date(dateRange?.from)}
        onChange={
          (date) =>
            date
              ? setDateRange({ from: date.toISOString(), to: dateRange.to })
              : ""
        }
        placeholderText="Start date"
      />
      <span className="font-semibold">to</span>
      <DatePicker
        selected={new Date(dateRange?.to)}
        onChange={
          (date) => date
            ? setDateRange({ from: dateRange.from, to: date.toISOString() })
            : ""
        }
        placeholderText="End date"
        minDate={new Date(dateRange?.from)}
      />
    </div>
  );
}

