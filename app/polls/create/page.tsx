"use client"

import useUser from "@/hooks/useUser";
import { CreatePollSchema } from "@/lib/schemas/poll";
import { useForm } from 'react-hook-form';
import { useRouter } from "next/navigation";
import { useState } from "react";
import z from "zod";
import { zodResolver } from '@hookform/resolvers/zod';
import { createClient } from "@/lib/supabase/client";
import Button from "@/components/common/Button";
import { FaCheck, FaPlus, FaQuestion, FaTrash } from "react-icons/fa";
import Footer from "@/components/common/Footer";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";


type FormData = z.infer<typeof CreatePollSchema>
//type FormData = z.input<typeof CreatePollSchema>, any, z.output<typeof CreatePollSchema>;

const CreatePollPage = () => {
  const router = useRouter();
  const { user } = useUser();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const defaultEndDate = new Date();
  defaultEndDate.setDate(defaultEndDate.getDate() + 7);
  const [endDate, setEndDate] = useState<Date>(defaultEndDate);


  const { register, handleSubmit, formState: { errors }, watch, setValue } = useForm<FormData>({
    resolver: zodResolver(CreatePollSchema),
    defaultValues: {
      options: [" ", " "],
      isAnonymous: false,
    }
  });

  const options = watch('options');

  const addOption = () => {
    setValue('options', [...options, '']);
  }

  const removeOption = (index: number) => {
    // has to be at least 2
    if (options.length == 2) return;
    const newOptions = [...options];
    newOptions.splice(index, 1)
    setValue('options', newOptions);
  }

  //Filter for exiration time selector
  const withinWeek = (date: Date) => {
    const weekFromNow = new Date();
    const startDate = new Date();
    weekFromNow.setDate(startDate.getDate() + 7)
    return new Date() < date && date < weekFromNow
  }

  const onSubmit = async (data: FormData) => {
    if (!user) {
      setError('You must be logged in to create a poll');
      return;
    }

    setIsLoading(true);
    setError(null);

    const supabase = createClient();
    try {
      const { data: poll, error } = await supabase
        .from('polls')
        .insert({
          question: data.question,
          options: data.options.filter(opt => opt.trim() !== ''),
          is_anonymous: data.isAnonymous,
          creator_id: user.id,
          expiry_date: endDate.toISOString()
        })
        .select()
        .single();

      if (error) throw error;

      //success redirect
      router.push(`/polls/${poll.id}`)
    } catch (err: unknown) {
      console.error('Error creating poll:', err);
      setError(err.message || 'Failed to create poll');
    } finally {
      setIsLoading(false);
    }
  }

  if (!user) {
    return (
      <div className="max-w-md mx-auto py-12 px-4">

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Authentication Required</h2>
          <p className="text-gray-700 mb-4">
            You need to be logged in to create a poll.
          </p>
          <div className="flex space-x-4">
            <Button
              onClick={() => router.push('/auth/login?returnTo=/polls/create')}
              variant="primary"
            >
              Login
            </Button>
            <Button
              onClick={() => router.push('/auth/register?returnTo=/polls/create')}
              variant="secondary"
            >
              Register
            </Button>
          </div>
        </div>
      </div>
    );
  }


  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Create a New Poll</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label htmlFor="question" className="block text-sm font-medium text-gray-700 mb-1">
            Poll Question
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaQuestion className="text-gray-400" />
            </div>
            <input
              id="question"
              type="text"
              {...register('question')}
              className={`pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm ${errors.question ? 'border-red-500' : 'border'
                }`}
              placeholder="Enter your question here"
            />
          </div>
          {errors.question && (
            <p className="mt-1 text-sm text-red-600">{errors.question.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Poll Options</label>
          {options.map((_, index) => (
            <div key={index} className="flex items-center mb-2">
              <div className="relative flex-grow">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaCheck className="text-gray-400" />
                </div>
                <input
                  type="text"
                  {...register(`options.${index}` as const)}
                  className={`pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm ${errors.options?.[index] ? 'border-red-500' : 'border'
                    }`}
                  placeholder={`Option ${index + 1}`}
                />
              </div>
              {options.length > 2 && (
                <button
                  type="button"
                  onClick={() => removeOption(index)}
                  className="ml-2 p-2 text-red-500 hover:text-red-700"
                  aria-label="Remove option"
                >
                  <FaTrash />
                </button>
              )}
            </div>
          ))}
          {errors.options?.message && (
            <p className="mt-1 text-sm text-red-600">{errors.options.message}</p>
          )}
          <button
            type="button"
            onClick={addOption}
            className="mt-2 flex items-center text-sm text-purple-600 hover:text-purple-800"
          >
            <FaPlus className="mr-1" /> Add another option
          </button>
        </div>

        <div className="flex items-center">
          <input
            id="isAnonymous"
            type="checkbox"
            {...register('isAnonymous')}
            className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
          />
          <label htmlFor="isAnonymous" className="ml-2 block text-sm text-gray-700">
            Make this poll anonymous (hide voter identities)
          </label>
        </div>

        <p> Add Expiry: </p>
        <span className="text-red-300"> NOTE: all surveys last for a max of 7 days</span>
        <div className="flex items-center">
          <DatePicker
            showTimeSelect
            selected={endDate}
            filterDate={withinWeek}
            onChange={(date) => setEndDate(date)}
            endDate={endDate}
            startDate={new Date()}
            minDate={new Date()}
          />
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4">
            <div className="flex">
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        <div className="pt-4">
          <Button
            type="submit"
            variant="primary"
            className="w-full flex justify-center"
            isLoading={isLoading}
          >
            Create Poll
          </Button>
        </div>
      </form>
      <Footer />
    </div>
  );
}

export default CreatePollPage;
