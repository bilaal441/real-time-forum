export function debounce(func, delay) {
  let timeoutId;

  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
}

export const Url = "http://localhost:3000/";

export const getJson = async (endpoint, aptions) => {
  try {
    const res = await fetch(`${Url}${endpoint}`, aptions);
    if (!res.ok) {
      const error = await res.json();
      throw Error(`${error.error} ${res.statusText} ${res.status} `);
    }
    return res.json();
  } catch (error) {
    throw error;
  }
};
