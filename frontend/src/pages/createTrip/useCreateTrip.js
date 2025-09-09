import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "@/context/auth";
import { generateTravelPlan } from "@/services/AIModel";
import { validateTripInputs } from "./validateTripInputs";

const initialFormData = {
    location: null,
    noOfDays: '',
    budget: '',
    traveler: ''
};

export const useCreateTrip = () => {
    const [formData, setFormData] = useState(initialFormData);
    const [loading, setLoading] = useState(false);
    const [showAuthModal, setShowAuthModal] = useState(false);
    // New state to prevent spamming the toast notifications
    const [isDisplayingErrors, setIsDisplayingErrors] = useState(false);

    const navigate = useNavigate();
    const { currentUser: user } = useAuth();

    const handleInputChange = (name, value) => {
        setFormData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };

    const openAuthModal = () => setShowAuthModal(true);
    const closeAuthModal = () => setShowAuthModal(false);

    const onGenerateTrip = async () => {
        // Guard clause: prevent running if already loading or showing errors
        if (loading || isDisplayingErrors) {
            return;
        }

        if (!user) {
            openAuthModal();
            return;
        }

        const errors = validateTripInputs(formData);
        if (errors.length) {
            setIsDisplayingErrors(true);

            errors.forEach((e, index) => {
                setTimeout(() => {
                    toast.error(e);
                }, index * 600); // Staggered display
            });

            // Set a timer to reset the flag after all toasts have been shown
            const totalToastTime = errors.length * 600;
            setTimeout(() => {
                setIsDisplayingErrors(false);
            }, totalToastTime);

            return;
        }

        setLoading(true);

        const tripData = {
            location: (formData.location && formData.location.label) || formData.location,
            noOfDays: formData.noOfDays,
            traveler: formData.traveler,
            budget: formData.budget,
        };

        try {
            const plan = await generateTravelPlan(tripData);
            if (!plan) {
                toast.error("Something went wrong, the plan could not be generated");
                return;
            }

            try {
                sessionStorage.setItem('plan', JSON.stringify(plan));

            } catch(err){
                console.warn('Could not save plan to sessionStorage', err)
            }
            navigate("/create-trip/view-trip", { state: { plan } });

        } catch (err) {
            console.error(err);
            toast.error(err.message);
        } finally {
            setLoading(false);
        }
    };

    return {
        formData,
        handleInputChange,
        loading,
        onGenerateTrip,
        showAuthModal,
        openAuthModal,
        closeAuthModal,
    };
};
