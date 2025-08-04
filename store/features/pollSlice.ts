import useUser from "@/hooks/useUser";
import { createPoll, fetchPolls, voteOnPoll } from "@/lib/services/polls";
import { Poll } from "@/lib/types";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

interface PollsState {
	polls: Poll[];
	loading: boolean;
	error: string | null;
	currentPoll: Poll | null;
}

const initialState: PollsState = {
	polls: [],
	loading: false,
	error: null,
	currentPoll: null
};


export const fetchPollsAsync = createAsyncThunk(
	'polls/fetchPolls',
	async () => {
		const response = await fetchPolls();
		return response;
	}
);

export const createPollAsync = createAsyncThunk(
	'polls/createPoll',
	async (pollData: { question: string; options: string[]; isAnonymous: boolean }) => {
		const { user } = useUser();
		const response = await createPoll(pollData, user ? user.id : null);
		return response;
	}
);


export const voteAsync = createAsyncThunk(
	'polls/vote',
	async ({ pollId, optionIndex }: { pollId: string; optionIndex: number }) => {
		const response = await voteOnPoll(pollId, optionIndex);
		return response;
	}
)

const pollsSlice = createSlice({
	name: 'polls',
	initialState,
	reducers: {
		setCurrentPoll: (state, action: PayloadAction<Poll>) => {
			state.currentPoll = action.payload;
		}
	},

	extraReducers: (builder) => {
		builder
			.addCase(fetchPollsAsync.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(fetchPollsAsync.fulfilled, (state, action) => {
				state.loading = false;
				state.polls = action.payload;
			})
			.addCase(fetchPollsAsync.rejected, (state, action) => {
				state.loading = false;
				state.error = action.error.message || 'Failed to fetch polls'
			})
			.addCase(createPollAsync.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(createPollAsync.fulfilled, (state, action) => {
				state.loading = false;
				state.polls.push(action.payload);
			})
			.addCase(createPollAsync.rejected, (state, action) => {
				state.loading = false;
				state.error = action.error.message || 'Failed to create poll';
			})
			.addCase(voteAsync.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(voteAsync.fulfilled, (state, action) => {
				state.loading = false;
				const updatePoll = action.payload;
				state.polls = state.polls.map(poll => poll.id === updatePoll.id ? updatePoll : poll);
				if (state.currentPoll?.id === updatePoll.id) {
					state.currentPoll = updatePoll;
				}
			})
			.addCase(voteAsync.rejected, (state, action) => {
				state.loading = false;
				state.error = action.error.message || 'Failed to vote';
			})
	}
})

export const { setCurrentPoll } = pollsSlice.actions;
export default pollsSlice.reducer;
