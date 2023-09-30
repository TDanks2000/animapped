export const isObjEmpty = (obj: any) => {
  if (!obj) return true;
  return Object.values(obj).length === 0 && obj.constructor === Object;
};
