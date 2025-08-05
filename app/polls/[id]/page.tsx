'use client'

import PollChart from "@/components/charts/PollChart";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import VoteForm from "@/components/polls/VoteForm";
import { PollOption } from "@/lib/schemas/poll";
import { fetchPollById } from "@/lib/services/polls";
import { createClient } from "@/lib/supabase/client";
import { Poll } from "@/lib/types";
import { User } from "@supabase/supabase-js";
import { subscribe } from "diagnostics_channel";
import { useRouter } from "next/navigation"
import { useParams } from 'next/navigation'
import { useEffect, useState } from "react";

const PollPage = () => {
	const router = useRouter();
	const params = useParams<{ id: string }>()
	const { id } = params;
	const [poll, setPoll] = useState<Poll | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [user, setUser] = useState<User | null>(null);

	//fetch a poll by id
	useEffect(() => {
		const supabase = createClient()
		if (!id) return;
		const fetchPoll = async () => {
			try {
				setLoading(true);
				const currPoll = await fetchPollById(id);
				const { data: { user } } = await supabase.auth.getUser();
				setPoll(currPoll)
				setUser(user);
			} catch (err: unknown) {
				setError(err.message);
			} finally {
				setLoading(false);
			}
		}
		fetchPoll();

		// Set up real-time subcription

		const subscription = supabase
			.channel(`poll:$id`)
			.on('postgres_changes', {
				event: 'INSERT',
				schema: 'public',
				table: 'votes',
				filter: `poll_id=eq.${id}`
			},
				async () => {
					// Refresh on new poll
					const data = await fetchPollById(id)
					setPoll(data);
				}
			)
			.subscribe();

		return () => {
			supabase.removeChannel(subscription);
		};
	}, [id]);



	if (loading) {
		return (
			<div className="flex justify-center items-center min-h-screen">
				<LoadingSpinner />
			</div>
		);
	}

	// go back home if error or no poll
	if (error || !poll) {
		return (
			<div className="flex justify-center items-center min-h-screen">
				<div className="bg-white p-6 rounded-lg shadow-md max-w-md w-full">
					<h2 className="text-xl font-semibold text-red-600 mb-4">{error ? "Error" : "Poll Not Found"}</h2>
					<p className="text-gray-700">{error}</p>
					<button
						onClick={() => router.push('/')}
						className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
					>
						Back to Home
					</button>
				</div>
			</div>
		);
	}

	const vote_cast = poll.votes.find((e) => e.userId === user?.id);
	return (
		<div className="max-w-4xl mx-auto py-8 px-4">
			<div className="mb-8">
				<h1 className="text-3xl font-bold text-gray-500 mb-2">{poll.question}</h1>
				<div className="flex items-center text-gray-400">
					<span className="text-sm">
						{poll.isAnonymous ? 'Anonymous poll' : `Created by ${poll.creator?.email}`}
					</span>
					<span className="mx-2">•</span>
					<span className="text-sm">
						{new Date(poll.createdAt).toLocaleDateString('en-US', {
							year: 'numeric',
							month: 'short',
							day: 'numeric',
						})}
					</span>
				</div>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
				{
					vote_cast ?
						<>
							<div className="rounded-lg shadow-md p-6">
								<h2 className="text-xl font-semibold mb-4">
									Already voted! for: <span className="text-green-400">
										{poll.options[vote_cast.optionIndex].text}
									</span>
								</h2>
							</div>
							<div className="rounded-lg shadow-md p-6">
								<h2 className="text-xl font-semibold mb-4">Live Results</h2>
								<PollChart poll={poll} />
								<div className="mt-4">
									<p className="text-gray-600 text-sm">
										Total votes: <span className="font-semibold">{poll.totalVotes}</span>
									</p>
								</div>
							</div>
						</>
						:
						<div className="rounded-lg shadow-md p-6">
							<h2 className="text-xl  font-semibold mb-4">Vote Now</h2>
							<VoteForm poll={poll} />
						</div>
				}
			</div>
		</div >
	);
}

export default PollPage;
