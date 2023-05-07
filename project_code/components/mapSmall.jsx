import MapGL, {GeolocateControl} from "react-map-gl"
import React, { useState } from "react";
import styles from '../styles/Home.module.css';

const Map = () => {

  const [viewport, setViewPort] = useState({
    width: "100%",
    height: "100%",
    latitude: 39.103119,
    longitude: -84.512016,
    zoom: 12.721197192553936
  });
  const _onViewportChange = viewport =>
    setViewPort({ ...viewport, transitionDuration: 20 });

  return (
    <MapGL
      {...viewport}
      mapboxApiAccessToken="pk.eyJ1IjoibmFkamFyam4iLCJhIjoiY2t3NGhxaG5jMDJmczMybzB2eGlseG00YyJ9.9JtTkfRgt0yY2188hkO7vQ"
      mapStyle="mapbox://styles/mapbox/streets-v11"
      onViewportChange={_onViewportChange}
      className={styles.smallMap}
    >
      <GeolocateControl
        positionOptions={{enableHighAccuracy: true}}
        trackUserLocation={true}
        auto
      />
    </MapGL>
  );
}

export default Map