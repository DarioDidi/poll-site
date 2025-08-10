'use client'

import { createClient } from "@/lib/supabase/client";
import { FullVote } from "@/lib/types";
import { useEffect, useState } from "react";
import VoteCard from "@/components/polls/VoteCard";
import { useParams } from "next/navigation";

const UserVotesPage = () => {
  const [votes, setVotes] = useState<FullVote[]>([]);
  const supabase = createClient();

  const params = useParams<{ id: string }>()
  const { id } = params;

  useEffect(() => {
    const fetchVotes = async () => {
      const { data } = await supabase
        .from('votes')
        .select(`*, 
          pollId: poll_id,
          createdAt: created_at,
          optionIndex: option_index,
          poll: polls(id, question, options)
        `)
        .eq('user_id', id);

      setVotes(data || []);
    };

    fetchVotes();
  }, [id, supabase]);

  return (
    <main className="min-h-screen flex flex-col items-center">
      <div className="flex-1 w-full flex flex-col gap-20 items-center">
        <div className="flex-1 flex flex-col gap-20 max-w-5xl p-5">
          <main className="flex-1 flex flex-col gap-6 px-4">
            <h2 className="font-medium text-4xl mb-4">View your Votes</h2>
            <div className="grid grid-cols-3 px-2 space-x-2">
              {votes.length === 0 ?
                <p>Nothing to see yet</p>
                : votes.map(vote => (
                  <VoteCard key={vote.id} vote={vote} />
                ))}
            </div>
          </main>
        </div>
      </div>
    </main >
  );
}

export default UserVotesPage;
