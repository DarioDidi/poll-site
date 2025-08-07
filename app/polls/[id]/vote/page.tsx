'use client'

import { createClient } from "@/lib/supabase/client";
import { Poll } from "@/lib/types";
import { useEffect, useState } from "react";
import Button from "@/components/common/Button";
import { useParams, useRouter } from "next/navigation";
import Form from 'next/form'
import { fetchPollById } from "@/lib/services/polls";
import { User } from "@supabase/supabase-js";
import LoadingSpinner from "@/components/common/LoadingSpinner";


const VotePage = () => {
	const router = useRouter()
	const [selectedOption, setSelectedOption] = useState<number | null>(null);
	const params = useParams<{ id: string }>()
	const { id } = params;
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [poll, setPoll] = useState<Poll | null>(null);
	const [loading, setLoading] = useState(true);
	const [user, setUser] = useState<User | null>(null);
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
	}, [id]);

	useEffect(() => {
		const vote_cast = poll?.votes.find((e) => e.userId === user?.id);
		if (vote_cast) {
			alert("Already voted")
			router.push(`/polls/${poll?.id}`)
			return;
		}
	})

	const handleVote = async () => {
		if (selectedOption === null) return;

		setIsSubmitting(true);
		setError(null);

		const supabase = createClient();
		try {
			const { data: { user } } = await supabase.auth.getUser();

			await supabase.from('votes').insert({
				poll_id: id,
				option_index: selectedOption,
				user_id: user?.id || null
			})
			router.push(`/polls/${id}`);
		} catch (err) {
			setError(err.message || 'Failed to submit vote');
		} finally {
			setIsSubmitting(false);
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




	//<div className="max-w-4xl mx-auto py-8 px-4">
	return (
		<div className="flex flex-col max-w-2xl mx-auto py-8 px-4">
			<h1 className="text-3xl font-bold text-gray-500 mb-2">{poll.question}</h1>
			<Form action={`/polls/${poll?.id}`} className="space-y-4 max-w-6xl " >
				{
					poll?.options.map((option) => (
						<div key={option.id} className="flex items-center">
							<input
								type="radio"
								id={`option-${option.id}`}
								name="poll-option"
								checked={selectedOption === option.id}
								onChange={() => setSelectedOption(option.id)}
								className="h-4 w-4 text-purple-600 focus:ring-purple-500"
							/>
							<label
								htmlFor={`option-${option.id}`}
								className="ml-3 block text-sm font-medium text-gray-700"
							>
								{option.text}
							</label>
						</div>
					))
				}

				{
					error && (
						<div className="text-red-500 text-sm mt-2">{error}</div>
					)
				}

				<div className="flex w-32 items-center">
					<Button
						type="submit"
						onClick={handleVote}
						disabled={selectedOption === null || isSubmitting}
						className="w-full mt-4"
						isLoading={isSubmitting}
					>
						Submit Vote
					</Button>
				</div>
			</Form >
		</div>
	);
};

export default VotePage;




