import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';
import { getProfile, updateProfile } from '@/api/profileApi';

type UserProfileContextType = {
  displayName: string;
  dailyGoal: number;
  setDailyGoal: (n: number) => void;
  avatar: string;
  loading: boolean;
  refreshProfile: () => Promise<void>;
};

const UserProfileContext = createContext<UserProfileContextType | null>(null);

const DEFAULT_AVATAR = '🌱';
const DEFAULT_GOAL = 1;

export function UserProfileProvider({ children }: { children: ReactNode }) {
  const [displayName, setDisplayNameState] = useState('');
  const [dailyGoal, setDailyGoalState] = useState(DEFAULT_GOAL);
  const [avatar, setAvatarState] = useState(DEFAULT_AVATAR);
  const [loading, setLoading] = useState(true);

  const refreshProfile = useCallback(async () => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const data = await getProfile();
      setDisplayNameState(data.display_name ?? '');
      setDailyGoalState(
        typeof data.daily_goal === 'number' ? data.daily_goal : DEFAULT_GOAL
      );
      setAvatarState(data.avatar ?? DEFAULT_AVATAR);
    } catch (e) {
      console.error('Failed to load profile', e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refreshProfile();
  }, [refreshProfile]);

  const setDailyGoal = useCallback(async (n: number) => {
    setDailyGoalState(n);
    try {
      await updateProfile({ daily_goal: n });
    } catch (e) {
      console.error('Failed to save daily goal', e);
    }
  }, []);

  return (
    <UserProfileContext.Provider
      value={{
        displayName,
        dailyGoal,
        setDailyGoal,
        avatar,
        loading,
        refreshProfile,
      }}
    >
      {children}
    </UserProfileContext.Provider>
  );
}

export function useUserProfile() {
  const ctx = useContext(UserProfileContext);
  if (!ctx) {
    throw new Error('useUserProfile must be used inside UserProfileProvider');
  }
  return ctx;
}

/** 기존 DailyGoal 컴포넌트 호환 */
export function useDailyGoal() {
  const { dailyGoal, setDailyGoal } = useUserProfile();
  return { dailyGoal, setDailyGoal };
}
