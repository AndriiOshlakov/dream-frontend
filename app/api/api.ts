import axios, { AxiosError } from 'axios';

export type ApiError = AxiosError<{ error: string }>;

export const api = axios.create({
  baseURL: 'https://dream-backend-a69s.onrender.com/api',
});
