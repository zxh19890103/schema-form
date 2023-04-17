export default (ms: number) => {
  return new Promise((r) => {
    setTimeout(r, ms);
  });
};
