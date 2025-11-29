/**
 * Projects Section Renderer
 * Renders project data from data/content.js into carousel HTML
 * Handles dynamic project tile creation and carousel filtering
 */

import { projects } from '../../data/content.js';

/**
 * Render a single project tile
 * @param {Object} project - Project object with title, description, image, link, tags
 * @param {string} category - Project category (datascience or software)
 * @returns {string} HTML for the project tile
 */
function renderProjectTile(project, category) {
  const tags = project.tags
    .map(tag => `<div class="tag">${tag}</div>`)
    .join('');

  const projectClass = category === 'datascience' ? 'ds-projects' : 'sd-projects';

  return `
    <div class="project-tile ${projectClass}" onclick="window.open('${project.link}', '_blank');">
      <div class="project-image">
        <div class="project-image-content">
          <img src="${project.image}" alt="Screenshot of ${project.title} project">
        </div>
      </div>
      <div class="project-text">
        <div class="project-text-content">
          <h1>${project.title}</h1>
          <p>${project.description}</p>
        </div>
      </div>
      <div class="project-tags">
        <div class="project-tags-content">
          ${tags}
        </div>
      </div>
    </div>
  `;
}

/**
 * Render all projects for a category
 * @param {string} category - Project category (datascience or software)
 * @returns {string} HTML for all projects in category
 */
function renderProjectRow(category) {
  const projectList = projects[category];

  if (!projectList) {
    console.warn(`[Projects] Category "${category}" not found`);
    return '';
  }

  return projectList
    .map(project => renderProjectTile(project, category))
    .join('');
}

/**
 * Initialize and render all projects
 * Replaces the old static project markup
 */
export function initializeProjects() {
  const dsContainer = document.getElementById('ds-projects-div');
  const sdContainer = document.getElementById('sd-projects-div');

  if (!dsContainer || !sdContainer) {
    console.warn('[Projects] Containers not found');
    return;
  }

  // Render Data Science projects
  dsContainer.innerHTML = renderProjectRow('datascience');

  // Render Software Development projects
  sdContainer.innerHTML = renderProjectRow('software');

  // Re-initialize carousel functionality
  initializeCarouselControls();
}

/**
 * Initialize carousel button controls for project filtering
 */
function initializeCarouselControls() {
  const buttons = document.querySelectorAll('.project-options');

  buttons.forEach(button => {
    button.addEventListener('click', (e) => {
      handleProjectFilter(buttons, e.target);
    });
  });
}

/**
 * Handle project carousel filtering based on button clicks
 * @param {NodeList} buttons - All project option buttons
 * @param {HTMLElement} clickedButton - The button that was clicked
 */
function handleProjectFilter(buttons, clickedButton) {
  const isActive = clickedButton.classList.contains('active');

  // Do nothing if button is already active
  if (isActive) return;

  const windowWidth = window.innerWidth;
  const category = clickedButton.classList[0]; // 'ds' or 'sd'

  // Determine animation parameters based on screen size
  const isDesktop = windowWidth > 800;
  const duration = isDesktop ? '1s' : '0.75s';
  const distance = isDesktop ? '-1022%' : '-333%';

  // Get carousel and project rows
  const carousel = document.querySelector('.project-carousel');
  const dsRow = document.getElementById('ds-projects-div');
  const sdRow = document.getElementById('sd-projects-div');

  if (!carousel || !dsRow || !sdRow) return;

  // Animate projects
  if (category === 'sd') {
    // Show Software Development, hide Data Science
    dsRow.style.transition = `transform ${duration}`;
    dsRow.style.transform = `translateX(${distance})`;
    sdRow.style.transition = `transform ${duration}`;
    sdRow.style.transform = `translateX(${distance})`;
  } else {
    // Show Data Science, hide Software Development
    dsRow.style.transition = `transform ${duration}`;
    dsRow.style.transform = 'translateX(0)';
    sdRow.style.transition = `transform ${duration}`;
    sdRow.style.transform = 'translateX(0)';
  }

  // Toggle active state on buttons
  buttons.forEach(btn => {
    btn.classList.toggle('active');
    btn.classList.toggle('inactive');
  });
}

// Note: Initialization is now handled by index.html's module script
// This component is imported and initialized there for better control over load order
