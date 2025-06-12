import { api } from './apiSlice';
import {
  GameDetailResponse,
  StartGameRequest,
  GameResponse,
  SubmitGuessRequest,
  SubmitGuessResponse,
  GameSummary,
  HintResponse,
  HintRequest,
} from '../../types/gameTypes';

export const gameApi = api.injectEndpoints({
  endpoints: (builder) => ({
    startGame: builder.mutation<GameResponse, StartGameRequest>({
      query: (body) => ({
        url: '/start',
        method: 'POST',
        body,
      }),
    }),
    getCountries: builder.query<string[], void>({
      query: () => '/countries',
    }),
    getGame: builder.query<
      GameDetailResponse,
      { gameId: string; username: string }
    >({
      query: ({ gameId, username }) =>
        `/game/${gameId}?player=${encodeURIComponent(username)}`,
      providesTags: ['Game'],
    }),
    getHint: builder.mutation<HintResponse, HintRequest>({
      query: (body) => ({
        url: '/hint',
        method: 'POST',
        body,
      }),
    }),
    listUserGames: builder.query<GameSummary[], string>({
      query: (username) => `/games?player=${encodeURIComponent(username)}`,
    }),
    sendGame: builder.mutation<
      { message: string },
      { gameId: string; sender: string }
    >({
      query: ({ gameId, sender }) => ({
        url: '/send',
        method: 'POST',
        body: { gameId, sender },
      }),
    }),
    submitGuess: builder.mutation<SubmitGuessResponse, SubmitGuessRequest>({
      query: (body) => ({
        url: '/guess',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Game'],
    }),
  }),
});

export const {
  useStartGameMutation,
  useGetCountriesQuery,
  useGetGameQuery,
  useGetHintMutation,
  useListUserGamesQuery,
  useSendGameMutation,
  useSubmitGuessMutation,
} = gameApi;
