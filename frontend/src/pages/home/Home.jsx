import React from "react";
import HeroSection from "@/components/HeroSection.jsx";
import TestimonialSection from "@/components/TestimonialSection.jsx";
import BenefitSection from "@/components/BenefitSection.jsx";
import Footer from "@/components/Footer.jsx";
import Promotion from "@/components/home/Promotion.jsx";
import WavySentenceSection from "@/components/home/WavySentenceSection.jsx";
import { DraggableCard } from "@/components/home/DraggableCard.jsx";



const Home = () => {
    return(
        <div className=" pt-10 sm:pt-4">
            <HeroSection/>
            <section className="relative overflow-hidden">
                <WavySentenceSection
                    
                    sentence="Building memories that feel alive, Turing Journeys into stories worth living"
                />
            </section>
            <DraggableCard/>
            {/* <TestimonialSection/> */}
            <Promotion/>
            <BenefitSection/>
            <Footer/>
        </div>
    )
}
export default Home