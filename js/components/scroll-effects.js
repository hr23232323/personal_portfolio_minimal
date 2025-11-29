/**
 * Scroll Effects Module
 * Handles dynamic UI changes based on scroll position:
 * - Social icon color changes (white over hero, dark over main content)
 */

/**
 * Initialize scroll effects
 * Sets up event listeners for scroll-based color changes
 */
export function initializeScrollEffects() {
  const landingDiv = document.querySelector('.landing-page');
  const iconList = document.querySelectorAll('.fa-icon');

  if (!landingDiv || iconList.length === 0) {
    return;
  }

  /**
   * Updates social icon colors on scroll
   * White icons over hero section, dark icons over main content
   */
  const handleScroll = () => {
    const landingBtm = landingDiv.getBoundingClientRect().bottom;

    iconList.forEach(icon => {
      const iconBtm = icon.getBoundingClientRect().bottom;

      /* If hero section is above icons, use dark text color */
      if (landingBtm < iconBtm) {
        icon.style.color = 'var(--text-primary)';
      } else {
        /* If icons are still over hero, use white text */
        icon.style.color = 'var(--bg-primary)';
      }
    });
  };

  document.addEventListener('scroll', handleScroll);
}

// Note: Initialization is now handled by index.html's module script
// This component is imported and initialized there for better control over load order
