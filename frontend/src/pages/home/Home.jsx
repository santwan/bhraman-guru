import React from "react";
import HeroSection from "../../components/HeroSection.jsx";
import TestimonialSection from "../../components/TestimonialSection.jsx";
import BenefitSection from "../../components/BenefitSection.jsx";
import Footer from "../../components/Footer.jsx";


const Home = () => {
    return(
        <div className=" pt-27">
            <HeroSection/>
            <TestimonialSection/>
            <BenefitSection/>
            <Footer/>
        </div>
    )
}


export default Home