import { BASE_URL, getHeaders, handleResponse } from './http.jsx';

export const generateInviteLink = async (eventId) => {
  const response = await fetch(`${BASE_URL}/events/${eventId}/open-invitation`, {
    method: 'POST',
    headers: getHeaders(),
  });
  return handleResponse(response);
};

export const joinGameByLink = async (inviteCodeOrLink) => {
  const response = await fetch(`${BASE_URL}/invite/join`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({ invitationLink: inviteCodeOrLink }),
  });
  return handleResponse(response);
};

export const sendInviteEmail = async (eventId, email) => {
  const response = await fetch(`${BASE_URL}/invitations/send-email`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({ eventId, email }),
  });
  return handleResponse(response);
};
