/**
 * Custom hook for framer-motion animations.
 * Provides a set of predefined animations and allows for customization.
 *
 * @param {string} [type='fadeInBottom'] - The type of animation.
 *   Available types: 'fadeInBottom', 'fadeIn', 'slideInLeft', 'slideInRight', 'zoomIn', 'stagger'.
 * @param {number} [delay=0] - The delay before the animation starts (in seconds).
 * @param {number} [duration=0.5] - The duration of the animation (in seconds).
 * @returns {object} Animation props to be spread onto a framer-motion component.
 */
export const useAnimation = (type = 'fadeInBottom', delay = 0, duration = 0.5) => {
  const variants = {
    fadeInBottom: {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
    },
    fadeIn: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
    },
    slideInLeft: {
      initial: { opacity: 0, x: -50 },
      animate: { opacity: 1, x: 0 },
    },
    slideInRight: {
      initial: { opacity: 0, x: 50 },
      animate: { opacity: 1, x: 0 },
    },
    zoomIn: {
      initial: { opacity: 0, scale: 0.9 },
      animate: { opacity: 1, scale: 1 },
    },
    stagger: {
      animate: {
        transition: {
          staggerChildren: 0.1,
        },
      },
    },
  };

  const selectedVariant = variants[type] || variants.fadeInBottom;

  return {
    ...selectedVariant,
    transition: {
      delay,
      duration,
      ease: 'easeInOut',
      ...selectedVariant.transition, // Allow variant to override transition
    },
  };
};
