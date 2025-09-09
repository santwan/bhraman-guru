import React from "react";
import { motion } from "framer-motion";
import PageHeader from "@/components/create-trip/PageHeader.jsx";
import DestinationInput from "@/components/create-trip/DestinationInput.jsx";
import DaysInput from "@/components/create-trip/DaysInput.jsx";
import BudgetSelector from "@/components/create-trip/BudgetSelector.jsx";
import TravelerSelector from "@/components/create-trip/TravelerSelector.jsx";
import GenerateButton from "@/components/create-trip/GenerateButton.jsx";
import AuthModal from "@/components/AuthModal.jsx";
import { useCreateTrip } from "./useCreateTrip.js";
import { useAnimation } from "@/hooks/useAnimation.js";
import { useAuth } from "@/context/auth";
import { Outlet } from "react-router-dom";

const CreateTrip = () => {
    const {
        formData,
        handleInputChange,
        loading,
        onGenerateTrip,
        showAuthModal,
        closeAuthModal
    } = useCreateTrip()

    const pageAnimation = useAnimation("fadeInBottom", 0.2, 0.6)

    const { loading: authLoading } = useAuth();

    return (
        <motion.div
          className="sm:px-10 md:px-32 lg:px-56 xl:px-60 px-5 pb-25 pt-30 mt-10"
          {...pageAnimation}
        >
          <PageHeader />
          <motion.div className="mt-10 space-y-10" {...useAnimation('stagger')}>
            <DestinationInput value={formData.location} handleInputChange={handleInputChange} />
            <DaysInput handleInputChange={handleInputChange} />
            <BudgetSelector formData={formData} handleInputChange={handleInputChange} />
            <TravelerSelector formData={formData} handleInputChange={handleInputChange} />
            <GenerateButton onGenerateTrip={onGenerateTrip} loading={loading || authLoading} />
          </motion.div>
          <Outlet/>
    
          {showAuthModal && <AuthModal isLogin={true} onClose={closeAuthModal} />}
        </motion.div>
      );
    
}

export default CreateTrip;