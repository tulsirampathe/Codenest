export const server = import.meta.env.VITE_SERVER || "http://localhost:5000"; // Use Vite's import.meta.env
export const config = {
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
};
