
export const subscribeExpect = (t, obsS, arrExpect) => {
  const arrExpectCopy = [].concat(arrExpect);
  obsS.subscribe(val => t.deepEqual(val, arrExpectCopy.shift()));
};


export const pushToSubject = (subjS, arr) => arr.map(i => subjS.next(i));


export const subjectHelper = (t, subj, arrIn, arrExpect) => {
  subscribeExpect(t, subj, arrExpect);
  pushToSubject(subj, arrIn);
  // arrIn.map(i => subj.next(i));
};
