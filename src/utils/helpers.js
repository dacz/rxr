
export const flattenArray = list => list.reduce(
  (a, b) => a.concat(Array.isArray(b) ? flattenArray(b) : b), []
);


export const normalizeScope = (arr) => flattenArray([].concat(arr.map(i => i || [])));


export const identifyStream = (tag, streamS) => streamS
    .map(msg => ({ streamName: tag, payload: msg }));
