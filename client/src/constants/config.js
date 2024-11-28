export const server = import.meta.env.VITE_SERVER;

export const config = {
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
};
