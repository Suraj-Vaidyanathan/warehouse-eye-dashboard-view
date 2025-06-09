
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export const useRealtimeData = <T>(
  tableName: string,
  initialData: T[] = []
) => {
  const [data, setData] = useState<T[]>(initialData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch initial data
    const fetchData = async () => {
      try {
        const { data: fetchedData, error } = await supabase
          .from(tableName)
          .select('*')
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        setData(fetchedData || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        console.error(`Error fetching ${tableName}:`, err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    // Set up real-time subscription
    const channel = supabase
      .channel(`${tableName}-changes`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: tableName
        },
        (payload) => {
          console.log(`${tableName} change received:`, payload);
          
          if (payload.eventType === 'INSERT') {
            setData(prev => [payload.new as T, ...prev]);
          } else if (payload.eventType === 'UPDATE') {
            setData(prev => prev.map(item => 
              (item as any).id === payload.new.id ? payload.new as T : item
            ));
          } else if (payload.eventType === 'DELETE') {
            setData(prev => prev.filter(item => 
              (item as any).id !== payload.old.id
            ));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [tableName]);

  return { data, loading, error };
};
