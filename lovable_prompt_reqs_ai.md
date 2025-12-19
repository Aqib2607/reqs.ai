# Lovable Prompt for Reqs.ai Frontend Development

## Project Overview
Create a modern, animated, and visually stunning web application called Reqs.ai. This application helps developers generate detailed project plans and Product Requirements Documents (PRD) using AI.

## Core Pages and Features

### 1. Landing Page
Create an impressive hero section with smooth animations. The page should immediately communicate the value proposition. Include a gradient background that transitions smoothly. Add floating elements with subtle parallax effects. Show the main heading "Transform Your Ideas into Detailed Project Plans" with a typewriter animation effect.

Place a prominent call-to-action button that says "Get Started Free" with a hover effect that scales and glows. Below the hero section, create a features showcase section with three columns. Each column should have an icon, heading, and description. The icons should animate when they scroll into view.

Add a "How It Works" section with four steps displayed as cards. Each card should appear with a slide-in animation from alternating directions. Include connecting lines between the cards with animated dots that travel along the path.

Create a testimonials section with cards that have glassmorphism effects. These cards should rotate in a carousel with smooth transitions. End with a final call-to-action section that has a vibrant gradient background and an email input field with an animated button.

### 2. Authentication Pages
Design a split-screen layout for both signup and login pages. The left side should display an animated illustration or abstract shapes that pulse gently. The right side contains the form with smooth focus animations on input fields.

For the signup page, include fields for name, email, password, and confirm password. Add real-time password strength indicator with color-coded bars that animate as the user types. Show validation messages that slide in smoothly below each field.

The login page should be simpler with just email and password fields. Include a "Remember Me" checkbox and a "Forgot Password" link. Add a subtle loading animation on the submit button when processing.

Both pages should have a smooth transition animation when switching between signup and login. Include social login buttons with hover effects that show the brand colors.

### 3. Main Dashboard (Idea Input Interface)
After login, show a clean dashboard with a centered focus on the main input area. Create a large, inviting text area with a placeholder that says "Describe your project idea here". The text area should have a subtle border glow effect on focus.

Above the text area, display a welcoming message with the user's name. Add a character counter that updates in real time. Below the text area, place a prominent "Generate Plan" button with a gradient background and a subtle shine animation.

On the sidebar, show quick stats like "Plans Generated" and "PRDs Created" in animated counter cards. Include a recent activity timeline with smooth entry animations. Add navigation links for Profile, API Settings, and Previous Plans.

### 4. Plan Generation View
When the user submits their idea, transition to a full-screen loading state with an animated progress indicator. Show encouraging messages that cycle through like "Analyzing your idea", "Structuring the plan", and "Finalizing details".

Once complete, display the generated plan in a beautiful card layout. Use a three-column grid that collapses on mobile. Each section should have expand and collapse animations. Include syntax highlighting for any code snippets mentioned in the plan.

Add action buttons at the top: "Generate PRD", "Edit Plan", "Save Plan", and "Share". These buttons should have distinct colors and hover states. Include a floating action button that allows quick navigation back to the input page.

### 5. PRD Generation View
Present the PRD in a document-like format with a clean typography hierarchy. Use a sidebar navigation that highlights the current section as the user scrolls. Add smooth scroll animations when clicking section links.

The PRD should include collapsible sections for different aspects like Technical Stack, Features, Architecture, and Timeline. Each section header should have an expand icon that rotates on click. Include the ability to edit sections inline with a rich text editor that appears smoothly.

Add export options at the top right: "Download PDF", "Export Markdown", and "Copy to Clipboard". These should trigger success animations when clicked. Include a version history sidebar that can slide in from the right.

### 6. Profile and Settings Page
Create a tabbed interface with smooth tab switching animations. The first tab shows user information with an avatar upload area that has drag and drop support with visual feedback.

The API Settings tab should display the current API key in a secure format with copy and regenerate options. Show API usage statistics with animated progress bars and charts. Include a form to add or update the Gemini API key with validation.

Add notification preferences with toggle switches that have smooth sliding animations. Include a danger zone section at the bottom for account deletion with a confirmation modal that slides up from the bottom.

## Design System Requirements

### Color Scheme
Use a modern color palette with a primary color of deep blue (like #2563EB). Add a secondary accent color of vibrant purple (#9333EA). Use gradients liberally, especially for buttons and hero sections. Background should be a very light gray (#F9FAFB) in light mode and a dark navy (#0F172A) in dark mode.

### Typography
Set the main font to Inter or a similar modern sans-serif. Use large, bold headings with generous letter spacing. Body text should be 16px minimum for readability. Code snippets should use a monospace font like Fira Code with syntax highlighting.

### Animations and Transitions
Every interaction should have a smooth transition of 200-300ms. Use easing functions like ease-in-out for natural movement. Buttons should have hover states that lift them slightly with a shadow. Cards should have subtle hover effects that scale them to 102%.

Page transitions should use fade and slide effects. Loading states should use skeleton screens with shimmer effects. Success actions should trigger confetti or checkmark animations. Add micro-interactions like ripple effects on button clicks.

### Responsive Design
Design mobile-first with breakpoints at 640px, 768px, 1024px, and 1280px. On mobile, convert the sidebar to a bottom navigation bar. Stack cards vertically and make buttons full-width. Ensure touch targets are at least 44px for mobile usability.

### Accessibility
Maintain a contrast ratio of at least 4.5:1 for all text. Add focus indicators for keyboard navigation. Include ARIA labels for all interactive elements. Ensure all animations respect prefers-reduced-motion settings.

## Component Library Suggestions
Use shadcn/ui components for consistency. Implement Framer Motion for smooth animations. Use React Hook Form for form management with validation. Add React Hot Toast for notifications. Include Recharts for any data visualizations in the dashboard.

## Technical Implementation Notes
Build with React and TypeScript for type safety. Use Tailwind CSS for styling with custom configuration for your brand colors. Implement React Router for navigation with animated transitions. Add React Query for API state management with optimistic updates.

Create reusable components like Button, Card, Input, Modal, and Dropdown. Each component should have variants for different states and sizes. Build a Layout component that handles the consistent header and navigation across pages.

## Special Features to Include
Add a dark mode toggle in the header with smooth theme transitions. Implement keyboard shortcuts like Ctrl+K for quick search. Add a command palette that slides down from the top. Include toast notifications for all user actions. Create empty states with illustrations for when users have no plans yet.

Add tooltips with helpful information throughout the interface. Implement auto-save functionality for plans being edited. Create a shareable link feature for generated plans with a unique URL. Add the ability to favorite or star important plans in the dashboard.

## Performance Considerations
Lazy load heavy components and pages. Optimize images with next-gen formats like WebP. Implement code splitting for faster initial load. Add loading skeletons to prevent layout shift. Cache API responses appropriately. Minimize bundle size by removing unused dependencies.

This prompt provides everything needed to create a production-ready, visually impressive frontend for Reqs.ai using Lovable or similar no-code/low-code platforms.