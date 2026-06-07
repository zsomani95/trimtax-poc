"use client";

import { useEffect, useRef } from "react";

// Import Leaflet CSS
import "leaflet/dist/leaflet.css";

// Property coordinates
const propertyCoords: Record<string, { lat: number; lng: number }> = {
  "0921754000023": { lat: 29.5597, lng: -95.5149 }, // Shadowlake, Houston
  "7534902": { lat: 29.6753, lng: -95.7217 }, // Aliana, Richmond
  "R112233": { lat: 29.7368, lng: -95.7304 }, // Lakemont, Richmond
};

export default function PropertyMap({ address }: { address: string }) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<any>(null);

  useEffect(() => {
    if (!mapContainer.current) return;

    // Dynamically import Leaflet to avoid SSR issues
    import("leaflet").then(({ default: L }) => {
      if (map.current) return; // Already initialized

      // Default to Houston area
      const coords = { lat: 29.76, lng: -95.37 };

      // Initialize map
      map.current = L.map(mapContainer.current).setView(
        [coords.lat, coords.lng],
        14
      );

      // Add tile layer
      L.tileLayer(
        "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        {
          attribution: "© OpenStreetMap contributors",
          maxZoom: 19,
        }
      ).addTo(map.current);

      // Add marker
      L.marker([coords.lat, coords.lng], {
        icon: L.icon({
          iconUrl:
            "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMiIgaGVpZ2h0PSI0MCIgdmlld0JveD0iMCAwIDMyIDQwIj48cGF0aCBmaWxsPSIjMTBiOTgxIiBkPSJNMTYgMEM4LjI3IDAgMiA1LjM3IDIgMTJjMCA2IDAgMTQgMTQgMjhjMTQtMTQgMTQtMjIgMTQtMjggMC02LjYzLTYuMjctMTItMTQtMTJ6Ii8+PHBhdGggZmlsbD0iI2ZmZiIgZD0iTTE2IDEzYzEuNjYgMCAzIDEuMzQgMyAzcy0xLjM0IDMtMyAzLTMtMS4zNC0zLTMgMS4zNC0zIDMtMyIvPjwvc3ZnPg==",
          iconSize: [32, 40],
          iconAnchor: [16, 40],
          popupAnchor: [0, -40],
        }),
      })
        .addTo(map.current)
        .bindPopup(`<div class="text-sm font-semibold">${address}</div>`);
    });
  }, [address]);

  return <div ref={mapContainer} className="w-full h-full" />;
}