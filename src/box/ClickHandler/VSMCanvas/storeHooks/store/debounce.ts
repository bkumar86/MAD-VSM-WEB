/**
 * Debounce - with support for multiple callers
 * @param fn - The function you want to run after a set @ms
 * @param ms - The time before running the @fn. In this time-window the method can be cancelled by another call this debounce method (with the same @caller)
 * @param caller - All callers with the same name will cancel another
 */
// eslint-disable-next-line @typescript-eslint/ban-types
export const debounce = (fn: Function, ms = 500, caller = "any") => {
  return function (this: unknown, ...args: unknown[]): void {
    clearTimeout(callers[caller]);
    callers[caller] = setTimeout(() => {
      fn.apply(this, args);
      delete callers[caller]; // Remember to collect your garbage
    }, ms);
  };
};

const callers = {}; // Store all ongoing-timers for all "callers".
