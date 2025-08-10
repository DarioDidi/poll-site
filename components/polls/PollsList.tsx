'use client';

import PollCard from "./PollCard";
import Search from "./SearchPolls";
import { useSearchParams } from "next/navigation";
import Pagination from "./Pagination";
import { ITEMS_PER_PAGE, Poll } from "@/lib/types";
import PollStatusFilter from "./PollStatusFilter";
import { checkActive } from "@/lib/utils";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { DateRangeFilter } from "./DateRangeFilter";
import { useEffect, useState } from "react";
import LoadingSpinner from "../common/LoadingSpinner";


const PollList = () => {
  const searchParams = useSearchParams();
  const stateData = useSelector((state: RootState) => state.polls);
  const { loading, error, statusFilter, dateFilter } = stateData;
  const { polls } = stateData;

  const [currPolls, setCurrentPolls] = useState<Poll[]>([]);
  const [totalPages, setTotalPages] = useState<number>(1);
  const currentPage = Number(searchParams.get('page')) || 1;
  const query = searchParams.get('query') || '';

  useEffect(() => {
    let filtered = [...polls];

    // Status filter
    if (statusFilter === "active") {
      filtered = filtered.filter(checkActive);
    } else if (statusFilter === "expired") {
      filtered = filtered.filter(p => !checkActive(p));
    }

    // Date filter
    if (dateFilter?.from && dateFilter?.to) {
      filtered = filtered.filter(p => {
        try {
          const fromDate = new Date(dateFilter.from);
          const toDate = new Date(dateFilter.to);
          const pollCreated = new Date(p.createdAt);
          return pollCreated >= fromDate && pollCreated <= toDate;
        } catch {
          return true;
        }
      });
    }

    // Search filter
    if (query) {
      filtered = filtered.filter(p =>
        p.question.toLowerCase().includes(query)
      );
    }

    // Pagination
    const totalFiltered = filtered.length;
    setTotalPages(Math.ceil(totalFiltered / ITEMS_PER_PAGE));

    const offset = (currentPage - 1) * ITEMS_PER_PAGE;
    setCurrentPolls(filtered.slice(offset, offset + ITEMS_PER_PAGE));
  }, [polls, query, dateFilter, statusFilter, currentPage]);


  if (loading) return <div><LoadingSpinner /></div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <div>
        <span className="flex flex-row justify-between gap-40 mb-2">
          <Search placeholder="Search polls..." />
          <PollStatusFilter />
        </span>
        <span className="flex flex-row gap-2 font-semibold">
          {"Date Range   "}
          <DateRangeFilter />
        </span>
      </div>
      <div className="grid:grid-cols">
        {
          currPolls.length === 0
            ? <p className="text-center justify-center">No polls Found :(</p>
            : currPolls.map(poll => (
              <PollCard key={poll.id} poll={poll} />
            ))
        }
      </div >
      <div className="mt-5 flex w-full justify-center">
        <Pagination totalPages={totalPages} />
      </div>
    </div>
  )
};

export default PollList;


