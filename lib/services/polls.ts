import { createClient } from '../supabase/client'
import { Poll, PollOption } from '../types'
import { CreatePollData } from '../schemas/poll';

export const getCurrentUser = async () => {
  const supabase = createClient();
  // You can also use getUser() which will be slower.
  const { data } = await supabase.auth.getClaims();
  const user = data?.claims;
  return user;
}

export const fetchPolls = async (): Promise<Poll[]> => {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('polls')
    .select(`
      id, 
      question,
      options,
      isAnonymous:is_anonymous,
      createdAt:created_at,
      creatorId:creator_id,
      expiryDate:expiry_date,
      creator:users(id, email),
      votes:votes(id, pollId:poll_id, userId:user_id, optionIndex:option_index)
    `).order('created_at', { ascending: false });

  //votes:votes(count, pollId:poll_id, userId:user_id, optionIndex:option_index)
  if (error) {
    console.error('Error fetching polls:', error);
    throw error;
  }


  return data.map(poll => {
    const totalVotes = poll.votes.length || 0;
    const optionsWithVotes = poll.options.map((text: string, index: number) => {
      const votesForOption = poll.votes.filter((vote) => vote.optionIndex === index).length;
      return {
        id: index,
        text,
        votes: votesForOption
      }
    });

    const optionsWithPercentage = optionsWithVotes.map((option: PollOption) => ({
      ...option,
      percentage: totalVotes > 0 ? Math.round((option.votes / totalVotes) * 100) : 0,
    }));


    return {
      ...poll,
      creator: poll.creator,
      options: optionsWithPercentage,
      totalVotes,
    };
  })
};

export const fetchPollById = async (id: string | string[]): Promise<Poll | null> => {
  const { data, error } = await createClient()
    .from('polls')
    .select(`
      id,
      question,
      options,
      isAnonymous:is_anonymous,
      createdAt:created_at,
      creatorId:creator_id,
      expiryDate:expiry_date,
      creator:users(id, email),
      votes:votes(id, pollId:poll_id, userId:user_id, optionIndex:option_index)
    `).eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching poll:', error);
    return null;
  }
  console.log("fetched poll:", data)

  // get votes for each option in the poll
  const optionWithVotes = data.options.map((text: string, index: number) => {
    const votesForOption = data.votes.filter((vote) => vote.optionIndex === index).length;
    return {
      id: index,
      text,
      votes: votesForOption
    }
  })

  const totalVotes = data.votes.length;

  const optionsWithPercentage = optionWithVotes.map((option: PollOption) => ({
    ...option,
    percentage: totalVotes > 0 ? Math.round((option.votes / totalVotes) * 100) : 0,
  }));

  console.log("options w %:", optionsWithPercentage);

  return {
    ...data,
    creator: data.creator,
    options: optionsWithPercentage,
    totalVotes,
  }
}


export const createPoll = async (pollData: CreatePollData, userId: string | null): Promise<Poll> => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('poll')
    .insert({
      question: pollData.question,
      options: pollData.options,
      is_anonymous: pollData.isAnonymous,
      creator_id: userId
    })
    .select()
    .single();


  if (error) {
    console.error('Error creating poll:', error);
    throw error;
  }

  // A fresh poll
  return {
    ...data,
    options: data.options.map((text: string, index: number) => ({
      id: index,
      text,
      votes: 0,
      percentage: 0
    })),
    totalVotes: 0
  }
};



export const voteOnPoll = async (pollId: string, optionIndex: number, userId?: string): Promise<Poll> => {
  const { error } = await createClient()
    .from('votes')
    .insert({
      poll_id: pollId,
      option_index: optionIndex,
      user_id: userId || null,
    });

  if (error) {
    console.error('Error voting on poll:', error);
    throw error;
  }

  const updatedPoll = await fetchPollById(pollId);
  if (!updatedPoll) {
    throw new Error('Failed to fetch updated poll after voting');
  }

  return updatedPoll;
}


export const fetchUserPolls = async (userId: string | string[]): Promise<Poll[] | null> => {
  const { data, error } = await createClient()
    .from('polls')
    .select(`
      id,
      question,
      options,
      isAnonymous:is_anonymous,
      createdAt:created_at,
      creatorId:creator_id,
      expiryDate:expiry_date,
      creator:users(id, email),
      votes:votes(id, pollId:poll_id, userId:user_id, optionIndex:option_index)
    `)
    .eq('creator.id', userId)
    .order('created_at', { ascending: false });

  //.single();

  if (error) {
    console.error('Error fetching poll:', error);
    return null;
  }

  console.log("user polls:", data);

  return data.map(poll => {
    const totalVotes = poll.votes.length || 0;
    const optionsWithVotes = poll.options.map((text: string, index: number) => {
      const votesForOption = poll.votes.filter((vote) => vote.optionIndex === index).length;
      return {
        id: index,
        text,
        votes: votesForOption
      }
    });

    const optionsWithPercentage = optionsWithVotes.map((option: PollOption) => ({
      ...option,
      percentage: totalVotes > 0 ? Math.round((option.votes / totalVotes) * 100) : 0,
    }));


    return {
      ...poll,
      creator: poll.creator,
      options: optionsWithPercentage,
      totalVotes,
    };
  })

  // get votes for each option in the poll
  // const optionWithVotes = data.options.map((text: string, index: number) => {
  //   const votesForOption = data.votes.filter((vote) => vote.optionIndex === index).length;
  //   return {
  //     id: index,
  //     text,
  //     votes: votesForOption
  //   }
  // })

  // const totalVotes = data.votes.length;

  // const optionsWithPercentage = optionWithVotes.map((option: PollOption) => ({
  //   ...option,
  //   percentage: totalVotes > 0 ? Math.round((option.votes / totalVotes) * 100) : 0,
  // }));

  // console.log("options w %:", optionsWithPercentage);

  // return {
  //   ...data,
  //   creator: data.creator,
  //   options: optionsWithPercentage,
  //   totalVotes,
  // }
}
