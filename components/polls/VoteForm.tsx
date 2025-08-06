'use client'

import { createClient } from "@/lib/supabase/client";
import { Poll } from "@/lib/types";
import { useState } from "react";
import Button from "../common/Button";
import { useRouter } from "next/navigation";
import Form from 'next/form'

interface VoteFormProps {
  poll: Poll
}

const VoteForm = ({ poll }: VoteFormProps) => {
  const router = useRouter()
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleVote = async () => {
    if (selectedOption === null) return;

    setIsSubmitting(true);
    setError(null);

    const supabase = createClient();
    try {
      const { data: { user } } = await supabase.auth.getUser();

      await supabase.from('votes').insert({
        poll_id: poll.id,
        option_index: selectedOption,
        user_id: user?.id || null
      })
      alert("Vote successful refresh to see results")
    } catch (err) {
      setError(err.message || 'Failed to submit vote');
    } finally {
      setIsSubmitting(false);
    }

  }

  return (
    <Form action={`/polls/${poll.id}`} className="space-y-4" >
      {
        poll.options.map((option) => (
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

      <Button
        type="submit"
        onClick={handleVote}
        disabled={selectedOption === null || isSubmitting}
        className="w-full mt-4"
        isLoading={isSubmitting}
      >
        Submit Vote
      </Button>
    </Form >
  );
};

export default VoteForm;




