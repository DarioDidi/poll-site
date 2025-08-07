'use client';

import { createClient } from "@/lib/supabase/client";
import { fetchPollsAsync } from "@/store/features/pollSlice";
import { AppDispatch, RootState } from "@/store/store"
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux"
import PollCard from "./PollCard";
import Search from "./SearchPolls";
import { useRouter, useSearchParams } from "next/navigation";

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


  const query = searchParams.get('query') || '';
  polls = polls.filter((item) => item.question.includes(query));

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
    </div>
  )
};

export default PollList;


