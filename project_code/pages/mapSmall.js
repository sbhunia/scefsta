// Start imports
import dynamic from "next/dynamic";

// Do not render the map server-side.
const MapNoSSR = dynamic(() => import("../components/mapSmall"), {
    ssr: false,
});

export default function SmallMap() {
    return (
        <div>
            <MapNoSSR />
        </div>
    )
}