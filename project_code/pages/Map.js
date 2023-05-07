// Start imports
import dynamic from "next/dynamic";
import mapStyles from "../styles/Map.module.css";

// Do not render the map server-side.
const MapNoSSR = dynamic(() => import("../components/map"), {
    ssr: false,
});

export default function map() {
    return (
        <div className={mapStyles.mapContainer}>
            <MapNoSSR />
        </div>
    )
}