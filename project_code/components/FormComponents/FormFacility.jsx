import React from "react";
import * as Constants from "../../pages/constants";

export const FormFacility = ({allowedHospitals, selectedData}) => {
    console.log(selectedData.facilityName);
    return (
        <div>
        {(function(){
            if (allowedHospitals.length === 0) {
                return (
                    <p>Please select a {Constants.HOSPITAL.toLowerCase()} from button above</p>
                );
            } else if (allowedHospitals.length === 1) {
                let address = `${selectedData.address}, ${selectedData.city}, ${selectedData.state}, ${selectedData.zipcode}`;
                return (
                    <div>
                        <p>NOTE: You can change the {Constants.HOSPITAL.toLowerCase()} above</p>
                        <p>Selected {Constants.HOSPITAL.toLowerCase()}: {selectedData.facilityName}</p>
                        <p>Address: {address}</p>
                        <p>Travel time (min): {selectedData.travelTime}</p>
                    </div>
                );
            } else if (allowedHospitals.length > 1) {
                return (
                    <p>Please select a single {Constants.HOSPITAL.toLowerCase()} from button above</p>
                );
            }
        })()}
        </div>
    );
}