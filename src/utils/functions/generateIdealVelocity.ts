export const generateIdealVelocity = (achievements: number | undefined, weeksNeeded: number) => {
  if (weeksNeeded < 0) weeksNeeded = 0;
  if (weeksNeeded > 20) weeksNeeded = 20;
  const data: Array<number | null | undefined> = new Array<number>(weeksNeeded);
  data[0] = achievements;

  for (let i = 1; i < weeksNeeded; i++) {
    data[i] = null;
  }
  data[weeksNeeded]=0
  return data;
};
