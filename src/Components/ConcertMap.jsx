import { useState, useEffect } from "react";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "100%",
};

export default function ConcertMap({ concerts, selectedConcertId, onMarkerClick }) {
  const [map, setMap] = useState(null);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: "AIzaSyCO1_mNGo4ssdi-yJnJHGSqlEDkAdN1lSQ",
  });

  const defaultCenter = { lat: 39.8283, lng: -98.5795 };

  useEffect(() => {
    if (selectedConcertId && map) {
      const concert = concerts.find((c) => c.id === selectedConcertId);
      if (concert) {
        map.panTo({ lat: concert.coordinates[0], lng: concert.coordinates[1] });
        map.setZoom(12);
      }
    }
  }, [selectedConcertId, map, concerts]);

  if (!isLoaded) return <div>Loading map...</div>;

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={defaultCenter}
      zoom={5}
      onLoad={(mapInstance) => setMap(mapInstance)}
    >
      {concerts.map((concert) => (
        <Marker
          key={concert.id}
          position={{
            lat: concert.coordinates[0],
            lng: concert.coordinates[1],
          }}
          onClick={() => onMarkerClick(concert.id)}
          icon={{
            url:
              selectedConcertId === concert.id
                ? "http://maps.google.com/mapfiles/ms/icons/purple-dot.png"
                : "http://maps.google.com/mapfiles/ms/icons/red-dot.png",
          }}
        />
      ))}
    </GoogleMap>
  );
}
