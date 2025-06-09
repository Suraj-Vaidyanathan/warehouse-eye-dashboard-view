
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface KPIData {
  goods_transported: number;
  vehicles_detected: number;
  detection_accuracy: number;
  system_uptime: number;
}

export const useKPIData = () => {
  const [kpiData, setKpiData] = useState<KPIData>({
    goods_transported: 0,
    vehicles_detected: 0,
    detection_accuracy: 98.7,
    system_uptime: 99.94
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchKPIData = async () => {
      try {
        // Get latest KPI snapshot
        const { data: kpiSnapshot } = await supabase
          .from('kpi_snapshots')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(1)
          .single();

        if (kpiSnapshot) {
          setKpiData({
            goods_transported: kpiSnapshot.goods_transported,
            vehicles_detected: kpiSnapshot.vehicles_detected,
            detection_accuracy: kpiSnapshot.detection_accuracy,
            system_uptime: kpiSnapshot.system_uptime
          });
        }

        // Get real-time counts
        const { count: goodsCount } = await supabase
          .from('goods')
          .select('*', { count: 'exact', head: true });

        const { count: vehiclesCount } = await supabase
          .from('vehicles')
          .select('*', { count: 'exact', head: true });

        setKpiData(prev => ({
          ...prev,
          goods_transported: goodsCount || prev.goods_transported,
          vehicles_detected: vehiclesCount || prev.vehicles_detected
        }));

      } catch (error) {
        console.error('Error fetching KPI data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchKPIData();

    // Update KPI data every 30 seconds
    const interval = setInterval(fetchKPIData, 30000);

    return () => clearInterval(interval);
  }, []);

  return { kpiData, loading };
};
