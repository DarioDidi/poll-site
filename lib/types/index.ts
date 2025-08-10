export const ITEMS_PER_PAGE = 6;

//export interface PollsUser {
//  id: string;
//  email: string;
//  //name: string;
//}

export type PollsUser = { id: string; email: string; };

export interface Poll {
  id: string;
  question: string;
  options: PollOption[],
  isAnonymous: boolean;
  createdAt: Date;
  creatorId: string;
  creator?: PollsUser[];
  //creator?: User;
  totalVotes: number;
  votes: Vote[];
  expiryDate: Date;
}

export interface PollOption {
  id: number;
  text: string;
  votes: number;
  percentage?: number
}

interface votePoll {
  id: string;
  options: string[];
  question: string;
}

export interface Vote {
  id: string;
  pollId: string;
  userId?: string;
  optionIndex: number;
  createdAt: Date;
}

export interface FullVote {
  id: string;
  pollId: string;
  userId?: string;
  optionIndex: number;
  createdAt: Date;
  poll: votePoll;
}

export interface CreatePollData {
  question: string;
  options: string[];
  isAnonymous: boolean;
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  success: boolean;
}

export interface ErrorResponseData {
  message: string
}


export interface DateRange {
  from: string,
  to: string
}

export const defaultDateRange: DateRange =
  { from: new Date('01-07-2025').toISOString(), to: new Date('01-01-2030').toISOString() }
