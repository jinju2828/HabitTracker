import axios from 'axios';
import { BASE_URL } from './habitApi';

function authHeader() {
  const token = localStorage.getItem('access_token');
  return { Authorization: `Bearer ${token}` };
}

export type UserProfile = {
  display_name: string | null;
  daily_goal: number;
  avatar: string | null;
};

export async function getProfile(): Promise<UserProfile> {
  const res = await axios.get<UserProfile>(`${BASE_URL}/users/me`, {
    headers: authHeader(),
  });
  return res.data;
}

export async function updateProfile(data: {
  display_name?: string;
  daily_goal?: number;
  avatar?: string;
}): Promise<UserProfile> {
  const res = await axios.patch<UserProfile>(`${BASE_URL}/users/me`, data, {
    headers: authHeader(),
  });
  return res.data;
}
