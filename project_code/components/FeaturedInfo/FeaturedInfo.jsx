import React from 'react';
import { FaHospitalSymbol, FaBuilding, FaFileContract } from 'react-icons/fa';
import * as Constants from '../../pages/constants';

export default function FeaturedInfo() {
    return (
        <div>
            <div className="FeaturedInfo_container">
                <div className="col-sm FeaturedInfo_item">
                    <span className="FeaturedInfo_title">Total Hospital Users</span>
                        <div className="FeaturedInfo_hospital-container">
                            <span className="FeaturedInfo_hospital-users"><FaHospitalSymbol /> 2,104</span>
                        </div>
                </div>

                <div className="col-sm FeaturedInfo_item">
                    <span className="FeaturedInfo_title">Total {Constants.POLICE} Users</span>
                        <div className="FeaturedInfo_hospital-container">
                            <span className="FeaturedInfo_hospital-users"><FaBuilding /> 557</span>
                        </div>
                </div>

                <div className="col-sm FeaturedInfo_item">
                    <span className="FeaturedInfo_title">Total Complete Bids</span>
                        <div className="FeaturedInfo_hospital-container">
                            <span className="FeaturedInfo_hospital-users"><FaFileContract /> 22,104</span>
                        </div>
                </div>
            </div>
        </div>
    )
}