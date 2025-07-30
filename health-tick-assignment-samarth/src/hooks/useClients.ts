import { useState, useEffect } from 'react';
import type{ Client } from '../types';
import { bookingService } from '../services/bookingService';

interface UseClientsReturn {
  clients: Client[];
  loading: boolean;
  error: string | null;
  searchClients: (searchTerm: string) => Client[];
}

/**
 * Custom hook for managing clients
 */
export const useClients = (): UseClientsReturn => {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Fetch all clients
   */
  useEffect(() => {
    const fetchClients = async () => {
      try {
        setLoading(true);
        setError(null);
        const fetchedClients = await bookingService.getClients();
        setClients(fetchedClients);
      } catch (err) {
        setError('Failed to load clients');
        console.error('Error fetching clients:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchClients();
  }, []);

  /**
   * Search clients by name or phone
   */
  const searchClients = (searchTerm: string): Client[] => {
    if (!searchTerm.trim()) return clients;
    
    const term = searchTerm.toLowerCase();
    return clients.filter(client =>
      client.name.toLowerCase().includes(term) ||
      client.phone.includes(searchTerm) ||
      client.email?.toLowerCase().includes(term)
    );
  };

  return {
    clients,
    loading,
    error,
    searchClients
  };
};