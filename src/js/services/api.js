const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const fetchData = async (endpoint) => {
  try {
    const response = await fetch(`${API_BASE_URL}/${endpoint}`);
    if (!response.ok) {
      return { error: `Failed to fetch ${endpoint}` };
    }
    const data = await response.json();
    return { results: data.results };
  } catch (error) {
    return { error: `Error fetching ${endpoint}: ${error.message}` };
  }
};

