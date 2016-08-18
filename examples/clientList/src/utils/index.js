export const findInObj = (obj, val) => {
  const re = new RegExp(val, 'i');
  return !!Object.keys(obj).filter(item => {
    if (typeof obj[item] === 'object') return findInObj(obj[item], val);
    return obj[item].match(re);
  }).length;
};
