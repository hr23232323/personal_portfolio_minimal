/* ============================================================
   SCRIPTS_MAIN.JS - LEGACY CONSOLIDATION POINT
   ============================================================
   This file is kept for backward compatibility.

   All interactive functionality has been moved to modular components
   located in js/components/:

   - experience.js        : Renders experience section from data
   - projects.js          : Handles projects carousel filtering
   - scroll-effects.js    : Handles scroll-based UI changes

   These components are imported and initialized from index.html
   using ES6 modules, providing better organization and maintainability.

   ARCHITECTURE MIGRATION:
   - Before: Monolithic scripts_main.js with all functionality
   - After: Component-based modules with single responsibility

   To add new interactive features:
   1. Create a new file in js/components/
   2. Export an initialize function
   3. Import and call it from index.html's module script
============================================================ */

// This file is intentionally minimal.
// All functionality has been moved to components in js/components/
