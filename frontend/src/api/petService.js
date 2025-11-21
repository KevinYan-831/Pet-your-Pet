const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

// Helper to get auth headers
// Note: This should be called with the session from useAuth context
const getAuthHeaders = (accessToken = null) => {
  const headers = {
    'Content-Type': 'application/json',
  };

  // Add Bearer token if logged in
  if (accessToken) {
    headers['Authorization'] = `Bearer ${accessToken}`;
  }

  return headers;
};

export const fetchPets = async (accessToken = null) => {
  try {
    const headers = getAuthHeaders(accessToken);
    const response = await fetch(`${API_BASE_URL}/pets`, { headers });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.error || 'Failed to fetch pets');
    }

    return result.data;
  } catch (error) {
    console.error('Error fetching pets from API:', error);
    throw error;
  }
};

export const createPet = async (petData, accessToken = null) => {
  try {
    const headers = getAuthHeaders(accessToken);
    const response = await fetch(`${API_BASE_URL}/pets`, {
      method: 'POST',
      headers,
      body: JSON.stringify(petData),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.error || 'Failed to create pet');
    }

    return result.data;
  } catch (error) {
    console.error('Error creating pet:', error);
    throw error;
  }
};

export const deletePet = async (id, accessToken = null) => {
  try {
    const headers = getAuthHeaders(accessToken);
    const response = await fetch(`${API_BASE_URL}/pets/${id}`, {
      method: 'DELETE',
      headers,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.error || 'Failed to delete pet');
    }

    return result.data;
  } catch (error) {
    console.error(`Error deleting pet ${id}:`, error);
    throw error;
  }
};