'use client'

import { setPollFilter } from "@/store/features/pollSlice";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { usePathname, useSearchParams, useRouter } from 'next/navigation';
import { createPageURL } from "./Pagination";

const PollStatusFilter = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { replace } = useRouter();

  const dispatch = useDispatch();
  const options = ['all', 'active', 'expired'];
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  useEffect(() => {
    dispatch(setPollFilter(selectedStatus));
    replace(createPageURL(pathname, searchParams, 1));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedStatus, dispatch]);


  return (
    <div className="flex gap-4 items-center">
      {options.map(opt =>
        <label className="inline-flex items-center" key={opt}>
          <input
            type="radio"
            className="form-radio h-4 w-4 text-indigo-600"
            name="pollStatus"
            value={opt}
            checked={selectedStatus === opt}
            onChange={() => setSelectedStatus(opt)}
          />
          <span className="ml-2">{`${opt} polls`}</span>
        </label>
      )}
    </div>
  );
}

export default PollStatusFilter;
