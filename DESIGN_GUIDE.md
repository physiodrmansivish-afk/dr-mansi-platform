# Design Implementation Guide
# Dr. Mansi Vishwakarma — Physiotherapy Platform

***

## How the Agent Should Use Design Files

All design exports are in the `/designs` folder at the root of this project.
Before building any page or component, **open the corresponding design image and study it fully**.

The design is the source of truth. Do not invent layouts. Do not substitute components.
Match spacing, typography, colors, and component structure exactly.

***

## Design File Naming Convention

| File | Corresponds To |
|---|---|
| `designs/home-page.png` | Public home page |
| `designs/about-page.png` | Public about page |
| `designs/services-page.png` | Public services page |
| `designs/areas-page.png` | Public areas we serve page |
| `designs/booking-page.png` | Public booking flow |
| `designs/contact-page.png` | Public contact page |
| `designs/dashboard-shell.png` | Dashboard layout and sidebar |
| `designs/dashboard-overview.png` | Dashboard overview/home |
| `designs/dashboard-appointments.png` | Appointments module |
| `designs/dashboard-availability.png` | Availability blocking |
| `designs/dashboard-patients.png` | Patients list and profile |
| `designs/dashboard-invoices.png` | Invoices module |
| `designs/dashboard-settings.png` | Settings page |
| `designs/mobile-booking.png` | Mobile booking flow |
| `designs/mobile-dashboard.png` | Mobile dashboard view |

***

## What to Extract From Each Design

When you open a design image, extract these before writing code:

### 1. Colors
- Background colors for each section
- Primary, secondary, and accent colors
- Text colors (heading, body, muted)
- Border and divider colors
- Status badge colors (booked, completed, cancelled, etc.)

### 2. Typography
- Font family used (identify from design or brand guide)
- Heading sizes and weights
- Body text sizes
- Label and badge text sizes

### 3. Spacing
- Padding inside cards and sections
- Gap between grid items
- Margins between sections

### 4. Component Shapes
- Border radius on cards, buttons, inputs, badges
- Shadow levels on elevated elements
- Border widths and styles

### 5. Layout Structure
- Number of columns on desktop vs mobile
- Sidebar width (dashboard)
- Max content width
- Navbar height

***

## Tailwind Implementation Rule

Extract the exact hex colors from the design and define them in tailwind.config.ts as custom tokens:

```ts
// tailwind.config.ts
theme: {
  extend: {
    colors: {
      primary: '#REPLACE_WITH_DESIGN_COLOR',
      'primary-hover': '#REPLACE_WITH_DESIGN_COLOR',
      'primary-light': '#REPLACE_WITH_DESIGN_COLOR',
      surface: '#REPLACE_WITH_DESIGN_COLOR',
      'surface-2': '#REPLACE_WITH_DESIGN_COLOR',
      border: '#REPLACE_WITH_DESIGN_COLOR',
      success: '#REPLACE_WITH_DESIGN_COLOR',
      warning: '#REPLACE_WITH_DESIGN_COLOR',
      error: '#REPLACE_WITH_DESIGN_COLOR',
      'text-primary': '#REPLACE_WITH_DESIGN_COLOR',
      'text-muted': '#REPLACE_WITH_DESIGN_COLOR',
    },
    fontFamily: {
      sans: ['REPLACE_WITH_DESIGN_FONT', 'sans-serif'],
      display: ['REPLACE_WITH_DESIGN_FONT', 'sans-serif'],
    },
    borderRadius: {
      card: 'REPLACE_WITH_DESIGN_VALUE',
      btn: 'REPLACE_WITH_DESIGN_VALUE',
    },
  },
}
```

**Replace all REPLACE_WITH_DESIGN_* values** by reading the design files.

***

## Component Rules

- Every reusable component has its own file.
- Public components: `src/components/public/`
- Dashboard components: `src/components/dashboard/`
- Shared components: `src/components/shared/`
- No inline styles. All Tailwind classes.
- Every interactive element has a hover and focus state.
- Every form input has an error state.
- Every list has an empty state.
- Every async data component has a loading skeleton.