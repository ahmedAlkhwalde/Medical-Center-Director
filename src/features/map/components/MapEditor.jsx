import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMap,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { motion as Motion } from "framer-motion";
import {
  LocationOnOutlined,
  SaveOutlined,
  RestartAltOutlined,
  EditLocationAltOutlined,
} from "@mui/icons-material";
import {
  resetDraftToSaved,
  saveLocation,
  setDraftLocation,
} from "../store/mapSlice";

if (typeof window !== "undefined") {
  delete L.Icon.Default.prototype._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
    iconUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
    shadowUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
  });
}

const MapClickHandler = ({ isEditing }) => {
  const dispatch = useDispatch();

  useMapEvents({
    click(event) {
      if (!isEditing) {
        return;
      }

      dispatch(
        setDraftLocation({
          latitude: event.latlng.lat,
          longitude: event.latlng.lng,
        }),
      );
    },
  });

  return null;
};

const MapSyncView = ({ location }) => {
  const map = useMap();

  useEffect(() => {
    map.setView([location.latitude, location.longitude], location.zoom, {
      animate: true,
    });
  }, [location, map]);

  return null;
};

const MapMarker = ({ location, isEditing }) => {
  const dispatch = useDispatch();

  const handleDragEnd = (event) => {
    const marker = event.target;
    const position = marker.getLatLng();

    dispatch(
      setDraftLocation({
        latitude: position.lat,
        longitude: position.lng,
        zoom: location.zoom,
      }),
    );
  };

  return (
    <Marker
      position={[location.latitude, location.longitude]}
      draggable={isEditing}
      eventHandlers={{ dragend: handleDragEnd }}
    >
      <Popup>
        <div className="space-y-1 text-center">
          <p className="font-bold">موقع المركز</p>
          <p className="text-xs text-gray-600">
            {location.latitude.toFixed(6)}, {location.longitude.toFixed(6)}
          </p>
        </div>
      </Popup>
    </Marker>
  );
};

const MapEditor = () => {
  const dispatch = useDispatch();
  const { draftLocation, isSaved } = useSelector((state) => state.map);
  const [isEditing, setIsEditing] = useState(false);

  const center = useMemo(
    () => [draftLocation.latitude, draftLocation.longitude],
    [draftLocation.latitude, draftLocation.longitude],
  );

  const handleLatChange = (event) => {
    dispatch(
      setDraftLocation({
        latitude: event.target.value,
        longitude: draftLocation.longitude,
        zoom: draftLocation.zoom,
      }),
    );
  };

  const handleLngChange = (event) => {
    dispatch(
      setDraftLocation({
        latitude: draftLocation.latitude,
        longitude: event.target.value,
        zoom: draftLocation.zoom,
      }),
    );
  };

  const handleSave = () => {
    dispatch(saveLocation());
    setIsEditing(false);
  };

  const handleReset = () => {
    dispatch(resetDraftToSaved());
    setIsEditing(false);
  };

  const handleStartEdit = () => {
    setIsEditing(true);
  };

  return (
    <div className="grid gap-5 lg:grid-cols-[1.3fr_0.7fr]">
      <Motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="overflow-hidden rounded-3xl border theme-border theme-surface shadow-xl"
      >
        <div className="flex items-center justify-between gap-3 border-b theme-border px-4 py-3 sm:px-5">
          <div className="text-right">
            <h2 className="text-lg font-bold theme-text">
              خريطة تحديد موقع المركز
            </h2>
            <p className="text-xs theme-text-muted">
              اضغط على الخريطة أو عدّل الإحداثيات يدويًا
            </p>
          </div>
          <LocationOnOutlined className="theme-text-accent" />
        </div>

        <div className="h-[420px] sm:h-[560px]">
          <MapContainer
            center={center}
            zoom={draftLocation.zoom}
            style={{ height: "100%", width: "100%" }}
            scrollWheelZoom
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <MapSyncView location={draftLocation} />
            <MapClickHandler isEditing={isEditing} />
            <MapMarker location={draftLocation} isEditing={isEditing} />
          </MapContainer>
        </div>
      </Motion.div>

      <Motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.08 }}
        className="rounded-3xl border theme-border theme-surface p-5 shadow-lg space-y-5"
      >
        <div className="text-right">
          <h3 className="text-xl font-bold theme-text">بيانات الموقع</h3>
          <p className="mt-1 text-sm theme-text-muted">
            هذا القسم مستقل ويحفظ موقع المركز فقط
          </p>
        </div>

        <Field
          label="خط العرض"
          value={draftLocation.latitude}
          onChange={handleLatChange}
        />
        <Field
          label="خط الطول"
          value={draftLocation.longitude}
          onChange={handleLngChange}
        />

        <div className="rounded-2xl theme-bg p-4 text-right">
          <p className="text-xs font-bold uppercase tracking-wide theme-text-muted">
            الموقع الحالي
          </p>
          <p className="mt-2 text-sm theme-text leading-7">
            {draftLocation.latitude.toFixed(6)} ,{" "}
            {draftLocation.longitude.toFixed(6)}
          </p>
          <p className="mt-2 text-xs theme-text-muted">
            {isSaved ? "تم الحفظ مسبقًا" : "يوجد تعديل غير محفوظ"}
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <button
            type="button"
            onClick={handleStartEdit}
            className="inline-flex items-center justify-center gap-2 rounded-2xl border theme-border theme-bg px-4 py-3 font-bold theme-text transition-colors hover:theme-hover-surface"
          >
            <EditLocationAltOutlined fontSize="small" />
            {isEditing ? "وضع التعديل مفعّل" : "تعديل الموقع"}
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="inline-flex items-center justify-center gap-2 rounded-2xl theme-accent px-4 py-3 font-bold theme-text-on-accent shadow-lg theme-shadow-accent transition-opacity hover:opacity-95"
            disabled={!isEditing}
          >
            <SaveOutlined fontSize="small" />
            حفظ الموقع
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center justify-center gap-2 rounded-2xl border theme-border theme-bg px-4 py-3 font-bold theme-text transition-colors hover:theme-hover-surface"
          >
            <RestartAltOutlined fontSize="small" />
            إرجاع الموقع المحفوظ
          </button>
        </div>

        <div className="rounded-2xl theme-accent-soft p-4 text-right">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="font-bold theme-text-accent">التعديل المباشر</p>
              <p className="mt-1 text-xs theme-text-muted">
                {isEditing
                  ? "يمكنك الآن سحب العلامة أو النقر في أي نقطة على الخريطة"
                  : "اضغط على زر تعديل الموقع لبدء التحريك والحفظ"}
              </p>
            </div>
            <EditLocationAltOutlined className="theme-text-accent" />
          </div>
        </div>
      </Motion.div>
    </div>
  );
};

const Field = ({ label, value, onChange }) => (
  <label className="block text-right">
    <span className="mb-2 block text-xs font-bold theme-text-muted">
      {label}
    </span>
    <input
      type="number"
      step="any"
      value={value}
      onChange={onChange}
      className="w-full rounded-2xl border theme-border theme-bg px-4 py-3 text-sm outline-none transition-all focus:ring-2 focus:ring-(--color-accent)"
    />
  </label>
);

export default MapEditor;
