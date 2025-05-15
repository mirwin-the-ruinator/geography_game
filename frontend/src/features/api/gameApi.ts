import { api } from './apiSlice';
import {
  GameDetailResponse,
  StartGameRequest,
  GameResponse,
  SubmitGuessRequest,
  SubmitGuessResponse,
  GameSummary,
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
    getGame: builder.query<GameDetailResponse, string>({
      query: (gameId) => `/game/${gameId}`,
      providesTags: ['Game'],
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
  useListUserGamesQuery,
  useSendGameMutation,
  useSubmitGuessMutation,
} = gameApi;
