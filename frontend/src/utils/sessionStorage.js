export const storeInSession = (key, data) => {
  sessionStorage.setItem(key, data);
};
export const lookInSession = (key) => {
  return sessionStorage.getItem(key);
};
export const removeFromSession = (key) => {
  sessionStorage.removeItem(key);
};
