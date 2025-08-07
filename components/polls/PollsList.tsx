'use client';

import { createClient } from "@/lib/supabase/client";
import { fetchPollsAsync } from "@/store/features/pollSlice";
import { AppDispatch, RootState } from "@/store/store"
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux"
import PollCard from "./PollCard";
import Search from "./SearchPolls";
import { useSearchParams } from "next/navigation";
import Pagination from "./Pagination";
import { ITEMS_PER_PAGE } from "@/lib/types";

const PollList = () => {
  const dispatch = useDispatch<AppDispatch>();
  const searchParams = useSearchParams();
  let { polls, loading, error } = useSelector((state: RootState) => state.polls);
  console.log("fecthed state polls in POLlList", polls);
  const supabase = createClient();

  useEffect(() => {
    dispatch(fetchPollsAsync());

    // realtime subscription to any changes in supabase db polls table
    const subscription = supabase
      .channel('polls_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'polls' }, () => {
        dispatch(fetchPollsAsync());
      })
      .subscribe();

    return () => {
      supabase.removeChannel(subscription)
    };

  }, [dispatch, supabase]);


  if (loading) return <div>Loading polls one sec...</div>;
  if (error) return <div>Error: {error}</div>;


  console.log("Polls:", polls);

  //SEARCH
  const query = searchParams.get('query') || '';
  polls = polls.filter((item) => item.question.includes(query));

  //PAGINATION
  const totalPages = Math.ceil(polls.length / ITEMS_PER_PAGE);
  const currentPage = Number(searchParams.get('page')) || 1;
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;
  polls = polls.slice(offset, offset + ITEMS_PER_PAGE);

  return (
    <div>
      <Search placeholder="Search polls..." />
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


