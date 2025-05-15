import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Player as Identity } from '../game/types';
import { LoginRequest, SignupRequest, UserSummaryResponse } from './types';

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:8000' }),
  endpoints: (builder) => ({
    signup: builder.mutation<Identity, SignupRequest>({
      query: (body) => ({
        url: '/signup',
        method: 'POST',
        body,
      }),
    }),
    login: builder.mutation<Identity, LoginRequest>({
      query: (body) => ({
        url: '/login',
        method: 'POST',
        body,
      }),
    }),
    getUserSummary: builder.query<UserSummaryResponse, string>({
      query: (username) =>
        `/user-summary?username=${encodeURIComponent(username)}`,
    }),
  }),
});

export const { useSignupMutation, useLoginMutation, useGetUserSummaryQuery } =
  authApi;
