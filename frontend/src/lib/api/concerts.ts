import { fetcher } from './fetcher';

export interface Concert {
  id: string;
  name: string;
  description: string;
  totalSeats: number;
}

export interface CreateConcertPayload {
  name: string;
  description: string;
  totalSeats: number;
}


const getAuthToken = () => {
  if (typeof document !== 'undefined') {
    const match = document.cookie.match(new RegExp('(^| )accessToken=([^;]+)'));
    if (match) return match[2];
  }
  return null;
};

export const concertsApi = {
  getAll() {
    const token = getAuthToken();
    return fetcher<Concert[]>('/concerts', {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` },
    });
  },
  
  create(data: CreateConcertPayload) {
    const token = getAuthToken();
    return fetcher<Concert>('/concerts', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: data,
    });
  },

  delete(id: string) {
    const token = getAuthToken();
    return fetcher(`/concerts/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
  },
};
