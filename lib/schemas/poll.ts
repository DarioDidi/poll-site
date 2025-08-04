import { z } from 'zod';

export const PollOptionSchema = z.object({
  id: z.number(),
  text: z.string().min(1, "Option cannot be empty"),
  votes: z.number().nonnegative(),
  percentage: z.number().min(0).max(100).optional(),
});

export const CreatePollSchema = z.object({
  question: z.string().min(5, "Question must be at least 5 characters"),
  options: z.array(z.string().min(1, "Option cannot be empty")).min(2, "At least two options are required"),
  isAnonymous: z.boolean()//.default(false)
});

export const VoteSchema = z.object({
  pollId: z.string().uuid(),
  optionIndex: z.number().nonnegative(),
});

export type PollOption = z.infer<typeof PollOptionSchema>;
export type CreatePollData = z.infer<typeof CreatePollSchema>;
export type VoteData = z.infer<typeof VoteSchema>;
