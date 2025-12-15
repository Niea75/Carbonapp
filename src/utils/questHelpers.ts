import { Quest } from '../types';

export const randomizeQuests = (pool: Quest[]) => {
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, 3).map((quest) => ({ ...quest, progress: 0, isComplete: false }));
};
