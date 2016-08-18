// function takes stream (observable) and produces observable
export const debounceInput = (obs) => obs.debounceTime(100);
