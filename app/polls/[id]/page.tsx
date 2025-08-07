'use client'

import PollChart from "@/components/charts/PollChart";
import Button from "@/components/common/Button";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import DeleteConfirmation from "@/components/polls/DeleteModal";
import VoteForm from "@/components/polls/VoteForm";
import { fetchPollById } from "@/lib/services/polls";
import { createClient } from "@/lib/supabase/client";
import { Poll } from "@/lib/types";
import { User } from "@supabase/supabase-js";
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
	const [isModalOpen, setModalOpen] = useState<boolean>(false);

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
			} catch (err) {
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

	const handleDelete = async (useId: string) => {
		const supabase = createClient();
		const { error } = await supabase
			.from('polls')
			.delete()
			.eq('id', useId)
			.select()
		if (error) {
			setError(error.message);
			setModalOpen(false)
		}
		else {
			alert(`Successfully deleted`);
			router.push("/");
		}
	}

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
	const expiryDate = new Date(poll.expiryDate);
	const isExpired = new Date() > expiryDate
	const milliDiff: number = isExpired
		? new Date().getTime() - expiryDate.getTime()
		: expiryDate.getTime() - new Date().getTime()
	const totalSeconds = Math.floor(milliDiff / 1000);
	const totalMinutes = Math.floor(totalSeconds / 60);
	const remMinutes = totalMinutes % 60
	const totalHours = Math.floor(totalMinutes / 60);
	const remHours = totalHours % 24;
	const totalDays = Math.floor(totalHours / 24);
	return (
		<div className="max-w-4xl mx-auto py-8 px-4">
			<div className="mb-8">
				<h1 className="text-3xl font-bold text-gray-500 mb-2">{poll.question}</h1>
				<div className="flex items-center text-gray-400 justify-between">
					<div>
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
					<span className="text-red-400">Expiry {`${totalDays} days ${remHours} hours ${remMinutes} mins`}
						{
							isExpired ? " ago"
								: ""
						}</span>
					{
						poll.creator && poll.creator?.id === user?.id
							? <Button variant="danger" onClick={() => setModalOpen(true)}>
								Delete Poll
							</Button>
							: ""
					}
				</div>
			</div>


			<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
				{
					(vote_cast || expiryDate < new Date()) ?
						<>
							<div className="rounded-lg shadow-md p-6 border">
								<h2 className="text-xl font-semibold mb-4">
									{vote_cast ?
										<>
											Already voted! for: <span className="text-green-400">
												{poll.options[vote_cast.optionIndex].text}
											</span>
										</>
										: expiryDate < new Date() ?
											<span className="text-red-300"> Poll Expired </span>
											: ""
									}
								</h2>
							</div>
							<div className="rounded-lg shadow-md p-6 border">
								{
									isExpired ?
										<h2 className="text-xl font-semibold mb-4">Final Results</h2>
										: <h2 className="text-xl font-semibold mb-4">Live Results</h2>
								}
								<div className="mt-1">
									<p className="text-gray-600 text-sm">
										Total votes: <span className="font-semibold">{poll.totalVotes}</span>
									</p>
								</div>
								<PollChart poll={poll} />
							</div>
						</>
						:
						<div className="rounded-lg shadow-md p-6">
							<h2 className="text-xl  font-semibold mb-4">Vote Now</h2>
							<Button
								onClick={() => router.push(`/polls/${poll.id}/vote`)}
							>
								<span className="text-green-500">Vote</span>
							</Button>
						</div>
				}
			</div>

			{
				isModalOpen &&
				(<DeleteConfirmation
					hideModal={() => setModalOpen(false)}
					confirmModal={handleDelete}
					message={`Are you sure you want to delete poll:${poll.question}`}
					pollId={poll.id}
				/>)
			}
		</div >
	);
}

export default PollPage;
