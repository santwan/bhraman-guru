import React from "react";
import HeroSection from "@/components/HeroSection.jsx";
import TestimonialSection from "@/components/TestimonialSection.jsx";
import BenefitSection from "@/components/BenefitSection.jsx";
import Footer from "@/components/Footer.jsx";
import Promotion from "@/components/home/Promotion.jsx";


const Home = () => {
    return(
        <div className=" pt-10 sm:pt-4">
            <HeroSection/>
            {/* <TestimonialSection/> */}
            <Promotion/>
            <BenefitSection/>
            <Footer/>
        </div>
    )
}
export default Home