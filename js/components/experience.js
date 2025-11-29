/**
 * Experience Section Renderer
 * Renders experience data from data/content.js into HTML
 * Handles bold, large typography for visual impact
 */

import { experiences } from '../../data/content.js';

/**
 * Render a single role within an experience
 * @param {Object} role - Role object with title, dates, achievements
 * @returns {string} HTML for the role
 */
function renderRole(role) {
  const achievements = role.achievements
    .map(achievement => `<li>${achievement}</li>`)
    .join('');

  return `
    <div class="role">
      <div class="role-header">
        <h2 class="role-title">${role.title}</h2>
        <div class="role-dates">${role.startDate} - ${role.endDate}</div>
      </div>
      <ul class="role-achievements">
        ${achievements}
      </ul>
    </div>
  `;
}

/**
 * Render a single experience/company
 * @param {Object} experience - Experience object with company and roles
 * @returns {string} HTML for the experience
 */
function renderExperience(experience) {
  const rolesHTML = experience.roles
    .map(role => renderRole(role))
    .join('');

  const subheaderHTML = experience.subheader
    ? `<p class="company-subheader">${experience.subheader}</p>`
    : '';

  return `
    <div class="experience-item" data-company="${experience.id}">
      <div class="experience-company-header">
        <h1 class="company-name">${experience.company}</h1>
        ${subheaderHTML}
      </div>
      <div class="experience-roles">
        ${rolesHTML}
      </div>
    </div>
  `;
}

/**
 * Initialize and render all experiences
 * Replaces the old static experience markup
 */
export function initializeExperiences() {
  const container = document.getElementById('experience-container');

  if (!container) {
    console.warn('[Experience] Container not found');
    return;
  }

  // Render all experiences
  const experiencesHTML = experiences
    .map(exp => renderExperience(exp))
    .join('');

  container.innerHTML = experiencesHTML;

  // Add any event listeners or interactivity here
  addExperienceInteractivity();
}

/**
 * Add interactivity to experience items (animations, hover effects, etc.)
 */
function addExperienceInteractivity() {
  const items = document.querySelectorAll('.experience-item');

  items.forEach((item, index) => {
    // Add staggered fade-in animation on page load
    item.style.animationDelay = `${index * 0.1}s`;
    item.classList.add('fade-in');

    // Optional: Add hover effects or click handlers
    const roles = item.querySelectorAll('.role');
    roles.forEach(role => {
      role.addEventListener('mouseenter', () => {
        role.classList.add('highlighted');
      });
      role.addEventListener('mouseleave', () => {
        role.classList.remove('highlighted');
      });
    });
  });
}

// Note: Initialization is now handled by index.html's module script
// This component is imported and initialized there for better control over load order
