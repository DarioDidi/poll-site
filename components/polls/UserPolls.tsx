'use client';

import { createClient } from "@/lib/supabase/client";
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
  const router = useRouter();

  const params = useParams<{ id: string }>()
  const { id } = params;
  const userId = id;
  const [polls, setPolls] = useState<Poll[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);

  //fetch a poll by id
  useEffect(() => {
    const supabase = createClient();
    console.log("before id:", userId);
    if (!userId) return;
    const fetchPolls = async () => {
      try {
        setLoading(true);
        console.log("BEFORE POLLS IN USEREFFECT");
        const userPolls = await fetchUserPolls(userId);
        console.log("AFTER POLLS IN USEREFFECT");
        const { data: { user } } = await supabase.auth.getUser();
        setPolls(userPolls)
        setUser(user);
        console.log("AFTER SETS IN USEREFFECT");
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchPolls();

    // Set up real-time subcription to changes in votes
    // for polls owned by user

    const pollIds = polls?.map((p) => p.id)
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
  }, []);



  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 text-sm mt-2">{error}</div>
    )
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


