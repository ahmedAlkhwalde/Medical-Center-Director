import { motion as Motion } from "framer-motion";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { PlaceOutlined } from "@mui/icons-material";
import MapEditor from "../components/MapEditor";
import { loadStoredLocation } from "../store/mapSlice";

const MapPage = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadStoredLocation());
  }, [dispatch]);

  return (
    <Motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="rounded-3xl border theme-border theme-surface p-5 shadow-lg sm:p-6">
        <div className="flex items-center gap-3 text-right">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl theme-accent-soft theme-text-accent">
            <PlaceOutlined />
          </div>
          <div>
            <h1 className="text-2xl font-bold theme-text">
              قسم تحديد موقع المركز
            </h1>
            <p className="mt-1 text-sm theme-text-muted">
              صفحة مستقلة لحفظ وتعديل موقع المركز على الخريطة فقط
            </p>
          </div>
        </div>
      </div>

      <MapEditor />
    </Motion.div>
  );
};

export default MapPage;
