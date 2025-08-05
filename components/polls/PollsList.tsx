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

  if (loading) return <div>Loading polls...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="grid gird-cols-22 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 mt-10">
      {
        polls.map(poll => (
          <PollCard key={poll.id} poll={poll} />
        ))
      }
    </div>
  )
};

export default PollList;


