import React, { useState, useEffect } from "react";
import * as Constants from '../../pages/constants';
import stylesP from '../../styles/Popup.module.css';
import HospitalDataGrid from "../Hospitals/HospitalDataGrid";
import { Map, GoogleApiWrapper } from 'google-maps-react';

const apiKey = 'AIzaSyCuaUMu_XxKd_FizshrvtxSrevO88DITiE'; // Replace with your actual API key

const AllowedHospitals = ({ address, city, state, zipcode, google }) => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [distance, setDistance] = useState(null);

  useEffect(() => {
    fetchHospitals();
  }, []);

  useEffect(() => {
    if (data && google) {
      calculateDistance();
    }
  }, [data, google]);

  const fetchHospitals = async () => {
    try {
      const response = await fetch(Constants.getHospitals);
      const json = await response.json();
      setData(json);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setIsLoading(false);
    }
  };

  const calculateDistance = () => {
    const origin = `${address}, ${city}, ${state} ${zipcode}`;
    const destinations = data.map((hospital) => `${hospital.address}, ${hospital.city}, ${hospital.state} ${hospital.zipcode}`);
    const service = new google.maps.DistanceMatrixService();
    
    service.getDistanceMatrix(
      {
        origins: [origin],
        destinations: destinations,
        travelMode: 'DRIVING',
      },
      (response, status) => {
        if (status === 'OK') {
          const elements = response.rows[0].elements;
          const distances = elements.map((element) => element.distance.value);
          setDistance(distances);
        } else {
          console.error('Error calculating distances:', status);
        }
      }
    );
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!data) {
    return <div>No data available</div>;
  }

  return (
    <div>
      <div className={stylesP.editHospital}>
        <h1>Allowed {Constants.HOSPITAL}s</h1>
      </div>
      <HospitalDataGrid data={data} popUpChecked={false} distances={distance} />
    </div>
  );
};

export default GoogleApiWrapper({
  apiKey: apiKey,
})(AllowedHospitals);
