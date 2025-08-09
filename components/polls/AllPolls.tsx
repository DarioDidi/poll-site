'use client'

import PollList from "@/components/polls/PollsList";
import { createClient } from "@/lib/supabase/client";
import { fetchPollsAsync } from "@/store/features/pollSlice";
import { AppDispatch } from "@/store/store";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

const AllPolls = () => {
  const supabase = createClient();
  const dispatch = useDispatch<AppDispatch>();

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

  return (
    <PollList />
  );
}

export default AllPolls;
