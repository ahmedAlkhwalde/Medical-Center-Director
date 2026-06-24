import { createSlice } from "@reduxjs/toolkit";

const STORAGE_KEY = "center-map-location";
const DEFAULT_LOCATION = {
  latitude: 33.5138,
  longitude: 36.2765,
  zoom: 14,
};

const readStoredLocation = () => {
  if (typeof window === "undefined") {
    return DEFAULT_LOCATION;
  }

  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);

    if (!stored) {
      return DEFAULT_LOCATION;
    }

    const parsed = JSON.parse(stored);
    return {
      latitude: Number(parsed.latitude) || DEFAULT_LOCATION.latitude,
      longitude: Number(parsed.longitude) || DEFAULT_LOCATION.longitude,
      zoom: Number(parsed.zoom) || DEFAULT_LOCATION.zoom,
    };
  } catch {
    return DEFAULT_LOCATION;
  }
};

const initialLocation = readStoredLocation();

const persistLocation = (location) => {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(location));
};

const mapSlice = createSlice({
  name: "map",
  initialState: {
    savedLocation: initialLocation,
    draftLocation: initialLocation,
    isSaved: true,
  },
  reducers: {
    setDraftLocation: (state, action) => {
      state.draftLocation = {
        latitude: Number(action.payload.latitude),
        longitude: Number(action.payload.longitude),
        zoom: Number(action.payload.zoom) || state.draftLocation.zoom,
      };
      state.isSaved = false;
    },
    saveLocation: (state) => {
      state.savedLocation = { ...state.draftLocation };
      state.isSaved = true;
      persistLocation(state.savedLocation);
    },
    resetDraftToSaved: (state) => {
      state.draftLocation = { ...state.savedLocation };
      state.isSaved = true;
    },
    loadStoredLocation: (state) => {
      const location = readStoredLocation();
      state.savedLocation = location;
      state.draftLocation = location;
      state.isSaved = true;
    },
  },
});

export const {
  setDraftLocation,
  saveLocation,
  resetDraftToSaved,
  loadStoredLocation,
} = mapSlice.actions;

export default mapSlice.reducer;
