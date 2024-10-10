import React from 'react';
import { MapContainer, TileLayer, Marker, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const SupplyLineMap = ({ pathCoordinates, currentLocation }) => {
  const center = [currentLocation.lat, currentLocation.lng];

  return (
    <div style={{ height: '400px', width: '100%' }}>
      <MapContainer center={center} zoom={6} style={{ height: "100%", width: "100%" }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors"
        />
        {pathCoordinates.map((coord, index) => (
          <Marker key={index} position={[coord.lat, coord.lng]} />
        ))}
        <Polyline positions={pathCoordinates} color="blue" />
        <Marker position={center} />
      </MapContainer>
    </div>
  );
};

export default SupplyLineMap;
