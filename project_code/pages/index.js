import React from "react";
import TopNavLanding from "../components/TopNavbar/TopNavLanding";
import styles from "../styles/Landing.module.css";
import Hero from "../components/LeadPage/Hero";
import Footer from "../components/LeadPage/Footer";

const App = ({ Component, pageProps }) => {
    return (
        <div className={styles.giveFlex}>
            <TopNavLanding />
            <Hero />
            <Footer />
        </div>
    )
}
export default App;
