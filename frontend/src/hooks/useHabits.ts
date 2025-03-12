// src/hooks/useHabits.ts
import { useState, useEffect } from 'react';
import { getHabits } from '@/api/habitApi';

export const useHabits = () => {
  const [habits, setHabits] = useState<{ id: number; name: string }[]>([]);

  const fetch = async () => {
    const data = await getHabits();
    setHabits(data);
  };

  useEffect(() => {
    fetch();
  }, []);

  return { habits, fetchHabits: fetch };
};
