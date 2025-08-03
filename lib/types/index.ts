export interface User {
  id: string;
  email: string;
  name: string;
}

export interface Poll {
  id: string;
  question: string;
  options: PollOption[],
  isAnonymous: boolean;
  createdAt: Date;
  creatorId: string;
  creator?: User;
  totalVotes: number;
}

export interface PollOption {
  id: number;
  text: string;
  votes: number;
  percentage?: number
}

export interface Vote {
  id: string;
  pollId: string;
  userId?: string;
  optionIndex: number;
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
