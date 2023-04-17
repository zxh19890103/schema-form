import { useReducer } from 'react';

let t = 2023;

const reducer = () => t++;

export const getTick = () => t;
export const useTick = () => {
  const [, dispatch] = useReducer(reducer, t, getTick);
  return dispatch;
};
