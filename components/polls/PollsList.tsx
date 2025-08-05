'use client';

import { createClient } from "@/lib/supabase/client";
import { fetchPollsAsync } from "@/store/features/pollSlice";
import { AppDispatch, RootState } from "@/store/store"
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux"
import PollCard from "./PollCard";

const PollList = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { polls, loading, error } = useSelector((state: RootState) => state.polls);
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

  {/*<div className="grid grid-cols-1 gap-4 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 mt-10">*/ }
  return (
    <div className="grid:grid-cols">
      {
        polls.length === 0
          ? <p className="text-center justify-center">No polls yet :(</p>
          : polls.map(poll => (
            <PollCard key={poll.id} poll={poll} />
          ))
      }
    </div >
  )
};

export default PollList;


