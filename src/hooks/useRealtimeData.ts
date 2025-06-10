
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type TableName = keyof Database['public']['Tables'];

export const useRealtimeData = (tableName: TableName) => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch initial data
    const fetchData = async () => {
      try {
        let query = supabase.from(tableName).select('*');
        
        // Use the appropriate timestamp field for ordering
        if (tableName === 'vehicles' || tableName === 'goods') {
          query = query.order('detected_at', { ascending: false });
        } else {
          query = query.order('created_at', { ascending: false });
        }
        
        const { data: fetchedData, error } = await query;
        
        if (error) throw error;
        setData(fetchedData || []);
        console.log(`Fetched ${tableName} data:`, fetchedData);
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
            setData(prev => [payload.new as any, ...prev]);
          } else if (payload.eventType === 'UPDATE') {
            setData(prev => prev.map(item => 
              (item as any).id === payload.new.id ? payload.new as any : item
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
