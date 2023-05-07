import React, { PureComponent,useEffect, useState } from "react";
import GoogleMapReact, { Marker } from 'google-map-react';
import '../public/m.png'

const AnyReactComponent = ({ text, gestureHandling}) => <div>< img style={{width:20}} src='m.png' alt="" /></div>;
const AnyReactComponentl = ({ text, gestureHandling}) => <div>< img style={{width:20}} src='am.png' alt="" /></div>;
const AnyReactComponentp = ({ text, gestureHandling}) => <div>< img style={{width:20}} src='pl.png' alt="" /></div>;
const AnyReactComponentpp = ({ text, gestureHandling}) => <div>< img style={{width:20}} src='pp.jpg' alt="" /></div>;
const AnyReactComponent2 = ({ text, gestureHandling}) => <div style={{width:100,height:100,border: '1px solid #000',transform:'translate(-50px,-50px)', borderRadius: 50,display: 'flex', alignItems: 'center', justifyContent: 'center'}}>< img style={{width:20}} src='m.png' alt="" /></div>;

export default function SimpleMap() {
    const [locations ,setLocations] = useState([])
    const [locationspp ,setLocationspp] = useState([])
    const [locations2 ,setLocations2] = useState([])
    useEffect(() => {


        function getLocation() {
            var options = {
                enableHighAccuracy: true,
                maximumAge: 1000
            };
            if (navigator.geolocation) {
                 // use geolocation
                navigator.geolocation.getCurrentPosition(onSuccess, onError, options);
            } else {
                // didn't support
            }
        }
        
        function onSuccess(position) {
            // get longitude
            var longitude = position.coords.longitude;
            // get latitude
            var latitude = position.coords.latitude;

            handleData(longitude, latitude);
        }
        
        // error massage
        function onError(error) {
            switch (error.code) {
                case 1:
                    //alert("Request denied！");
                    break;
                case 2:
                    alert("Can't get location！");
                    break;
                case 3:
                    alert("Time out！");
                    break;
                case 4:
                    alert("Unknow error！");
                    break;
            }

            var longitude = 39.9151;
            var latitude = 116.4041;
            handleData(longitude, latitude);
        }

        const handleData = (longitude,latitude) => {
            fetch('/api/hospitals').then((res) => {
                return res.json()
            }).then((data) => {
                const run = async () => {
                    for(let i = 0; i<data.length;i++) {

                        if ( data[i].hospitalSystem) {
                            const res = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(data[i].address)}&key=AIzaSyCuaUMu_XxKd_FizshrvtxSrevO88DITiE`)
                            const data2 = await res.json()
                            data[i].googleData = data2.results[0]&&data2.results[0]?.geometry?.location || {}
                        }
                        if (data[i].licencePlate) {
                            const res = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(data[i].address)}&key=AIzaSyCuaUMu_XxKd_FizshrvtxSrevO88DITiE`)
                            const data2 = await res.json()
                            data[i].googleDatal = data2.results[0]&&data2.results[0]?.geometry?.location || {}
                        }
                        if (data[i].policeDept) {
                            const res = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(data[i].address)}&key=AIzaSyCuaUMu_XxKd_FizshrvtxSrevO88DITiE`)
                            const data2 = await res.json()
                            data[i].googleDatap = data2.results[0]&&data2.results[0]?.geometry?.location || {}
                        }


                    }
                    console.log(data)
                    setLocations([...data])
                    setLocations2([{...data[0],googleData: {lng:longitude,lat:latitude}}])
                }
                run()
    
    
            })
            fetch('/api/patients').then((res) => {
                return res.json()
            }).then((data) => {
                const run = async () => {
                    for(let i = 0; i<data.length;i++) {

                            const res = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(data[i].address)}&key=AIzaSyCuaUMu_XxKd_FizshrvtxSrevO88DITiE`)
                            const data2 = await res.json()
                            data[i].googleData = data2.results[0]&&data2.results[0]?.geometry?.location || {}
           


                    }
                    setLocationspp([...data])
                }
                run()
    
    
            })
        }

        getLocation()


    },[])
    const defaultProps = {
        center: {
            lat: 39.499639,
            lng: -84.740597
        },
        zoom: 11
    };

    return (
        // Important! Always set the container height explicitly
        <div style={{ height: '75vh', width: '100%',padding:'20px 90px 0' }}>
            <GoogleMapReact
                bootstrapURLKeys={{ key: "AIzaSyCuaUMu_XxKd_FizshrvtxSrevO88DITiE" }}
                defaultCenter={defaultProps.center}
                marker={locations.map((el) => el.googleData)}
                defaultZoom={defaultProps.zoom}
                options={{ gestureHandling: "greedy" }}
            >
                {locations.filter((el) => el.googleData && el.googleData.lat).map((el) => <AnyReactComponent
                    lat={el.googleData.lat}
                    lng={el.googleData.lng}
                    text="123"
                    res
                >
                    
                </AnyReactComponent>)}
                {locations2.filter((el) => el.googleData && el.googleData.lat).map((el) => <AnyReactComponent2
                    lat={el.googleData.lat}
                    lng={el.googleData.lng}
                    text="123"
                    res
                >
                    
                </AnyReactComponent2>)}
                {locations.filter((el) => el.googleDatap && el.googleDatap.lat).map((el) => <AnyReactComponentp
                    lat={el.googleDatap.lat}
                    lng={el.googleDatap.lng}
                    text="123"
                    res
                >
                    
                </AnyReactComponentp>)}
                {locations.filter((el) => el.googleDatal && el.googleDatal.lat).map((el) => <AnyReactComponentl
                    lat={el.googleDatal.lat}
                    lng={el.googleDatal.lng}
                    text="123"
                    res
                >
                    
                </AnyReactComponentl>)}
                {locationspp.filter((el) => el.googleData && el.googleData.lat).map((el) => <AnyReactComponentpp
                    lat={el.googleData.lat}
                    lng={el.googleData.lng}
                    text="123"
                    res
                >
                    
                </AnyReactComponentpp>)}

            </GoogleMapReact>
        </div>
    );

}