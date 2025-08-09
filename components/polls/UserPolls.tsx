'use client';

import { createClient } from "@/lib/supabase/client";
import { useParams } from 'next/navigation'
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { fetchUserPollsAsync } from "@/store/features/pollSlice";
import PollList from "./PollsList";

const UserPolls = () => {
  const params = useParams<{ id: string }>()
  const { id } = params;
  const userId = id;
  const dispatch = useDispatch<AppDispatch>();
  const stateData = useSelector((state: RootState) => state.polls);

  useEffect(() => {
    const supabase = createClient();
    if (!userId) return;

    //fetch  polls by id
    dispatch(fetchUserPollsAsync(userId))

    // Set up real-time subcription to changes in votes
    // for polls owned by user
    const { polls } = stateData;
    const pollIds = polls.map((p) => p.id)
    const subscription = supabase
      .channel(`user:${userId}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'votes',
        filter: `poll_id=in.${[pollIds]}`
      },
        async () => {
          dispatch(fetchUserPollsAsync(userId))
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);


  {/*<div className="grid grid-cols-1 gap-4 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 mt-10">*/ }
  return (<PollList />
  )
};

export default UserPolls;


