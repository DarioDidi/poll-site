'use client'

import PollList from "@/components/polls/PollsList";
import { createClient } from "@/lib/supabase/client";
import { fetchPollsAsync } from "@/store/features/pollSlice";
import { AppDispatch } from "@/store/store";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

export default function PollsPage() {
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
    <main className="min-h-screen flex flex-col items-center">
      <div className="flex-1 w-full flex flex-col gap-20 items-center">
        <div className="flex-1 flex flex-col gap-20 max-w-5xl p-5">
          <main className="flex-1 flex flex-col gap-6 px-4">
            <h2 className="font-medium text-center text-6xl mb-4">Welcome to your fave Polls Site</h2>
            <PollList />
          </main>
        </div>
      </div>
    </main >
  );
}
