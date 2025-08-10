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


const PollList = () => {
  const searchParams = useSearchParams();
  const stateData = useSelector((state: RootState) => state.polls);
  const { loading, error, statusFilter, dateFilter } = stateData;
  let { polls } = stateData;

  if (loading) return <div>Loading polls one sec...</div>;
  if (error) return <div>Error: {error}</div>;

  // Filter by active or expired
  switch (statusFilter) {
    case "all":
      break;
    case "active":
      polls = polls.filter(checkActive)
      break;
    case "expired":
      polls = polls.filter((p: Poll) => !checkActive(p))
      break;
    default:
      break;
  }

  //filter by date range 
  polls = polls.filter((p: Poll) => {
    const fromDate = new Date(dateFilter.from);
    const toDate = new Date(dateFilter.to);
    const pollCreated = new Date(p.createdAt);
    console.log("created:", pollCreated, "from date", fromDate, "gt", pollCreated > fromDate)
    return pollCreated > fromDate
      && pollCreated < toDate
  })


  //SEARCH
  const query = searchParams.get('query') || '';
  polls = polls.filter((item: Poll) => item.question.includes(query));

  //PAGINATION
  const totalPages = Math.ceil(polls.length / ITEMS_PER_PAGE);
  const currentPage = Number(searchParams.get('page')) || 1;
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;
  polls = polls.slice(offset, offset + ITEMS_PER_PAGE);

  return (
    <div>
      <div>
        <Search placeholder="Search polls..." />
        <PollStatusFilter />
        <span className="flex flex-row gap-2 font-semibold">
          {"Pick Range   "}
          <DateRangeFilter />
        </span>
      </div>
      <div className="grid:grid-cols">
        {
          polls.length === 0
            ? <p className="text-center justify-center">No polls yet :(</p>
            : polls.map(poll => (
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


