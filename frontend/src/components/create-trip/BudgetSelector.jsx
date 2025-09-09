/**
 * @file BudgetSelector.jsx
 * @description This component acts as a container to display a grid of budget options for a user to select from. It manages the overall layout and state logic for the selection process.
 *
 * @component BudgetSelector
 * @overview A component that maps over a list of budget options and renders a `BudgetOptionCard` for each one. It determines which card is selected and passes the necessary data and callbacks down to its children.
 *
 * @props
 * - @formData {Object}: The current state of the parent form, used to determine which budget option is currently selected.
 * - @handleInputChange {Function}: A callback function passed down to each `BudgetOptionCard` to handle state updates when an option is selected.
 *
 * @logic
 * This component's primary responsibility is orchestration.
 * - It initializes a "fade in" animation for the entire container.
 * - It iterates through the `SelectBudgetOptions` array.
 * - For each option, it renders a `BudgetOptionCard` child component.
 * - It calculates whether an option is the currently selected one and passes this information as the `isSelected` prop to the child card.
 * - It passes the `handleInputChange` function directly to each child card so they can trigger state changes.
 *
 * @exports
 * - `BudgetSelector`: The container component for displaying budget options.
 */
import React from 'react';

// Imports the constant array of budget options.
import { SelectBudgetOptions } from '@/constants/option.jsx';

// Imports a custom hook for handling animations.
import { useAnimation } from '@/hooks/useAnimation';

// Imports the `motion` component for animations from Framer Motion.
import { motion } from 'framer-motion';
// Imports the child component responsible for rendering a single budget option card.
import BudgetOptionCard from './BudgetOptionCard.jsx';

const BudgetSelector = ({ formData, handleInputChange }) => {
  // Sets up the initial fade-in animation for the entire component.
  const formElementAnimation = useAnimation('fadeInBottom', 0.4);

  return (
    // The root `motion.div` applies the animation to the whole component.
    <motion.div {...formElementAnimation}>

      {/* Component Title and Subtitle */}
      <h2 className="font-semibold mb-0">What is Your Budget?</h2>
      <h3 className="font-normal mb-2">
        The budget is exclusively allocated for activities and dining purposes.
      </h3>

      {/* Grid container that will hold all the budget option cards. */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        
        {/* Map over the budget options to render a card for each. */}
        {SelectBudgetOptions.map((item, idx) => (
          // Render the specialized card component for each item in the array.
          <BudgetOptionCard
            key={idx} // Essential unique key for list rendering in React.
            item={item} // Pass the entire item object (title, desc, icon) to the child.
            // Calculate if this card is the selected one and pass the boolean result as a prop.
            isSelected={formData.budget === item.title}
            // Pass the state update function down to the child component.
            handleInputChange={handleInputChange}
          />
        ))}
      </div>
    </motion.div>
  );
};

// Export the component for use in other parts of the application.
export default BudgetSelector;