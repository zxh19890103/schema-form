/**
 * @todo merge recursively.
 */
export const merge = (dest: object, ...sources: object[]) => {
  return sources.reduce((val, cur, i) => {
    return { ...val, ...cur };
  }, dest);
};

export const o2options = (o: Record<string, any>) => {
  if (!o) return [];

  const options = Object.entries(o).map(([k, v]) => {
    return {
      value: k,
      label: v,
    };
  });

  console.log(options);
  return options;
};
