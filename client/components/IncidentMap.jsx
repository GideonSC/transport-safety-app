import { useEffect, useRef, useState } from 'react';

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || 'YOUR_GOOGLE_MAPS_API_KEY';
const SCRIPT_ID = 'google-maps-api-script';

function loadGoogleMapsScript() {
  return new Promise((resolve, reject) => {
    if (window.google?.maps) {
      resolve(window.google.maps);
      return;
    }

    const existing = document.getElementById(SCRIPT_ID);
    if (existing) {
      existing.addEventListener('load', () => {
        if (window.google?.maps) resolve(window.google.maps);
        else reject(new Error('Google Maps failed to load'));
      });
      existing.addEventListener('error', () => reject(new Error('Google Maps script failed to load')));
      return;
    }

    const script = document.createElement('script');
    script.id = SCRIPT_ID;
    script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}`;
    script.async = true;
    script.defer = true;
    script.onload = () => {
      if (window.google?.maps) {
        resolve(window.google.maps);
      } else {
        reject(new Error('Google Maps object missing after script load'));
      }
    };
    script.onerror = () => reject(new Error('Google Maps script failed to load'));
    document.head.appendChild(script);
  });
}

export default function IncidentMap({ reports }) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!reports?.length) {
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError('');

    loadGoogleMapsScript()
      .then((maps) => {
        if (cancelled) return;

        if (!mapInstanceRef.current) {
          mapInstanceRef.current = new maps.Map(mapRef.current, {
            center: {
              lat: Number(reports[0].latitude) || 0,
              lng: Number(reports[0].longitude) || 0,
            },
            zoom: 12,
          });
        }

        markersRef.current.forEach((marker) => marker.setMap(null));
        markersRef.current = [];

        const bounds = new maps.LatLngBounds();
        reports.forEach((report) => {
          if (report.latitude == null || report.longitude == null) return;

          const position = {
            lat: Number(report.latitude),
            lng: Number(report.longitude),
          };

          const marker = new maps.Marker({
            position,
            map: mapInstanceRef.current,
            title: report.incidentType,
          });

          const infoContent = `
            <div style="font-family: Arial, sans-serif; max-width: 240px;">
              <strong>${report.incidentType}</strong>
              <p style="margin:0.4rem 0;">${report.locationName}</p>
              <p style="margin:0.4rem 0;">Status: ${report.status}</p>
              <p style="margin:0.4rem 0; font-size:0.9rem; color:#4a5568;">${new Date(report.createdAt).toLocaleString()}</p>
            </div>
          `;

          const infoWindow = new maps.InfoWindow({ content: infoContent });
          marker.addListener('click', () => infoWindow.open({ anchor: marker, map: mapInstanceRef.current }));
          markersRef.current.push(marker);
          bounds.extend(position);
        });

        if (!bounds.isEmpty && reports.length > 0) {
          mapInstanceRef.current.fitBounds(bounds);
        }

        setLoading(false);
      })
      .catch(() => {
        if (!cancelled) {
          setError('Unable to load Google Maps. Check your API key and network connection.');
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
      markersRef.current.forEach((marker) => marker.setMap(null));
      markersRef.current = [];
    };
  }, [reports]);

  if (!reports?.length) {
    return <p>No incident locations available to display.</p>;
  }

  if (loading) {
    return <p>Loading map...</p>;
  }

  if (error) {
    return <p style={{ color: 'crimson' }}>{error}</p>;
  }

  return <div className="map-container" ref={mapRef} />;
}
