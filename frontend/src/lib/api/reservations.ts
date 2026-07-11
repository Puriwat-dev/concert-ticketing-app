import { fetcher } from './fetcher';

const getAuthToken = () => {
  if (typeof document !== 'undefined') {
    const match = document.cookie.match(new RegExp('(^| )accessToken=([^;]+)'));
    if (match) return match[2];
  }
  return null;
};

export interface Reservation {
  id: string;
  action: 'RESERVE' | 'CANCEL';
  updatedAt: string;
  createdAt: string;
  user: {
    fullName: string;
  };
  concert: {
    id: string;
    name: string;
  };
}

export const reservationsApi = {
  getUserHistory() {
    const token = getAuthToken();
    return fetcher<Reservation[]>('/reservations/history', {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` },
    });
  },

  getAllReservations() {
    const token = getAuthToken();
    return fetcher<Reservation[]>('/reservations/audit', {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` },
    });
  },

  reserve(concertId: string) {
    const token = getAuthToken();
    return fetcher('/reservations', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: { concertId },
    });
  },
  cancel(concertId: string) {
    const token = getAuthToken();
    return fetcher(`/reservations/${concertId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
  },
};
