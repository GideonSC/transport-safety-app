import { useEffect, useState } from 'react';
import { getReports } from '../services/api';

export function useFetchReports() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await getReports();
        setReports(response.data);
      } catch (err) {
        setError(err.message || 'Unable to load reports');
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  return { reports, loading, error };
}
