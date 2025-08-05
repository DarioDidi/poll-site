'use client';

import { createClient } from "@/lib/supabase/client";
import { fetchPollsAsync } from "@/store/features/pollSlice";
import { AppDispatch, RootState } from "@/store/store"
import { useDispatch, useSelector } from "react-redux"
import { User } from "@supabase/supabase-js";
import { useRouter } from "next/navigation"
import { useParams } from 'next/navigation'
import { useEffect, useState } from "react";
import PollCard from "./PollCard";
import { fetchUserPolls } from "@/lib/services/polls";
import { Poll } from "@/lib/types";
import LoadingSpinner from "../common/LoadingSpinner";


//const UserPolls = (userId: string) => {
const UserPolls = () => {
  const dispatch = useDispatch<AppDispatch>();
  //const { polls, loading, error } = useSelector((state: RootState) => state.polls);
  const supabase = createClient();
  const router = useRouter();

  const params = useParams<{ userId: string }>()
  const { userId } = params;
  const [polls, setPolls] = useState<Poll[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);

  //fetch a poll by id
  useEffect(() => {
    const supabase = createClient()
    if (!userId) return;
    const fetchPolls = async () => {
      try {
        setLoading(true);
        const userPolls = await fetchUserPolls(userId);
        const { data: { user } } = await supabase.auth.getUser();
        setPolls(userPolls)
        setUser(user);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchPolls();

    // Set up real-time subcription to changes in votes
    // for polls owned by user

    let pollIds = polls?.map((p) => p.id);
    const subscription = supabase
      .channel(`user:${userId}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'votes',
        filter: `poll_id=in.${[pollIds]}`
      },
        async () => {
          // Refresh on new poll
          const data = await fetchUserPolls(userId)
          setPolls(data);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, [userId]);



  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  console.log("Polls:", polls);

  {/*<div className="grid grid-cols-1 gap-4 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 mt-10">*/ }
  return (
    <div className="grid:grid-cols">
      {
        polls?.length === 0
          ? <p className="text-center justify-center">No polls yet :(</p>
          : polls?.map(poll => (
            <PollCard key={poll.id} poll={poll} />
          ))
      }
    </div >
  )
};

export default UserPolls;


