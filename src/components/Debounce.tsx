let timeoutId: ReturnType<typeof setTimeout>;
export const debounce = (fn: () => void, ms = 300) => {
  return function (this: never, ...args: []) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn.apply(this, args), ms);
  };
};
