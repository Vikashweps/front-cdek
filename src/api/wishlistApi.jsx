import { BASE_URL, getHeaders, handleResponse } from './http.jsx';

export const fetchMyWishlist = async (eventId) => {
  const response = await fetch(`${BASE_URL}/users/me/wishlist?eventId=${eventId}`, {
    method: 'GET',
    headers: getHeaders(),
  });
  return handleResponse(response);
};

export const fetchParticipantWishlist = async (participantId, eventId) => {
  const response = await fetch(
    `${BASE_URL}/wishlists/${participantId}?eventId=${eventId}`,
    {
      method: 'GET',
      headers: getHeaders(),
    }
  );
  return handleResponse(response);
};

export const addWishlistItem = async (wishlistId, itemData) => {
  const response = await fetch(`${BASE_URL}/wishlists/${wishlistId}/items`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(itemData),
  });
  return handleResponse(response);
};

export const deleteWishlistItem = async (wishlistId, itemId) => {
  const response = await fetch(`${BASE_URL}/wishlists/${wishlistId}/items/${itemId}`, {
    method: 'DELETE',
    headers: getHeaders(),
  });
  return handleResponse(response);
};
