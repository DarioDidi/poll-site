'use client';

import { createClient } from "@/lib/supabase/client";
import { useParams } from 'next/navigation'
import { useEffect, useState } from "react";
import PollCard from "./PollCard";
import { fetchUserPolls } from "@/lib/services/polls";
import { Poll } from "@/lib/types";
import LoadingSpinner from "../common/LoadingSpinner";
import { useSearchParams } from "next/navigation";
import Pagination from "./Pagination";
import { ITEMS_PER_PAGE } from "@/lib/types";
import Search from "./SearchPolls";

const UserPolls = () => {
  const params = useParams<{ id: string }>()
  const searchParams = useSearchParams();
  const { id } = params;
  const userId = id;
  const [polls, setPolls] = useState<Poll[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  console.log("in user polls");
  //fetch a poll by id
  useEffect(() => {
    const supabase = createClient();
    if (!userId) return;
    const fetchPolls = async () => {
      try {
        setLoading(true);
        const { data: { user } } = await supabase.auth.getUser();

        if (!(userId == user?.id)) return;

        const userPolls = await fetchUserPolls(userId);
        setPolls(userPolls)
      } catch (error) {
        setError(error.message);
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
  }, [userId]);

  let filteredPolls = polls;
  //SEARCH
  const query = searchParams.get('query') || '';
  filteredPolls = (filteredPolls?.filter((item) => item.question.includes(query)) || null);

  //PAGINATION
  const totalPages = Math.ceil(((polls?.length || 1) / ITEMS_PER_PAGE));
  const currentPage = Number(searchParams.get('page')) || 1;
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;
  filteredPolls = (filteredPolls?.slice(offset, offset + ITEMS_PER_PAGE) || null);


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
    <div>
      <Search placeholder="Search polls..." />
      <div className="grid:grid-cols">
        {
          filteredPolls?.length === 0
            ? <p className="text-center justify-center">No polls yet :(</p>
            : filteredPolls?.map(poll => (
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

export default UserPolls;


