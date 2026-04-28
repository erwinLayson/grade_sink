/**
 * ============================================================================
 * TAILWIND CSS CONFIGURATION GUIDE
 * ============================================================================
 * 
 * Configuration for Grade Sink using the modern design system.
 * This file explains what should be in your tailwind.config.js
 * 
 * Last Updated: April 28, 2026
 */

/**
 * ============================================================================
 * RECOMMENDED TAILWIND CONFIG (tailwind.config.js)
 * ============================================================================
 * 
 * Copy this to your tailwind.config.js or vite.config.ts
 */

export const RECOMMENDED_TAILWIND_CONFIG = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],

  theme: {
    extend: {
      colors: {
        // Keep default Tailwind colors but extend with our palette
        indigo: {
          50: '#EEF2FF',
          100: '#E0E7FF',
          200: '#C7D2FE',
          300: '#A5B4FC',
          400: '#818CF8',
          500: '#6366F1',
          600: '#4F46E5', // Primary
          700: '#4338CA',
          800: '#3730A3',
          900: '#312E81',
        },
        emerald: {
          50: '#F0FDF4',
          100: '#DCFCE7',
          200: '#BBEF63',
          300: '#86EFAC',
          400: '#4ADE80',
          500: '#22C55E',
          600: '#059669', // Success
          700: '#047857',
          800: '#065F46',
          900: '#064E3B',
        },
        rose: {
          50: '#FFF5F7',
          100: '#FFE4E6',
          200: '#FECDD3',
          300: '#FBCFE8',
          400: '#FB7185',
          500: '#F43F5E', // Danger
          600: '#E11D48',
          700: '#BE185D',
          800: '#9D174D',
          900: '#831843',
        },
        amber: {
          50: '#FFFBEB',
          100: '#FEF3C7',
          200: '#FDE68A',
          300: '#FCD34D',
          400: '#FBBF24',
          500: '#F59E0B', // Warning
          600: '#D97706',
          700: '#B45309',
          800: '#92400E',
          900: '#78350F',
        },
        slate: {
          0: '#FFFFFF',
          50: '#F8FAFC',
          100: '#F1F5F9',
          200: '#E2E8F0',
          300: '#CBD5E1',
          400: '#94A3B8',
          500: '#64748B',
          600: '#475569', // Secondary text
          700: '#334155',
          800: '#1E293B',
          900: '#0F172A',
        },
        purple: {
          50: '#FAF5FF',
          100: '#F3E8FF',
          200: '#E9D5FF',
          300: '#D8B4FE',
          400: '#D8B4FE',
          500: '#C084FC',
          600: '#9333EA', // Secondary brand
          700: '#7E22CE',
          800: '#6B21A8',
          900: '#581C87',
        },
        cyan: {
          50: '#ECFDFD',
          100: '#CFFAFE',
          200: '#A5F3FC',
          300: '#67E8F9',
          400: '#22D3EE',
          500: '#06B6D4',
          600: '#0891B2', // Accent
          700: '#0E7490',
          800: '#155E75',
          900: '#164E63',
        },
      },

      spacing: {
        'xs': '0.25rem',   // 4px
        'sm': '0.5rem',    // 8px
        'md': '1rem',      // 16px
        'lg': '1.5rem',    // 24px
        'xl': '2rem',      // 32px
        '2xl': '2.5rem',   // 40px
        '3xl': '3rem',     // 48px
      },

      borderRadius: {
        'sm': '0.25rem',    // 4px
        'base': '0.375rem', // 6px
        'md': '0.5rem',     // 8px
        'lg': '0.75rem',    // 12px
        'xl': '1rem',       // 16px
      },

      boxShadow: {
        'none': 'none',
        'sm': '0 1px 2px 0 rgb(0 0 0 / 0.05)',
        'base': '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
        'md': '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
        'lg': '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
        'xl': '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
        'hover': '0 10px 25px -5px rgb(0 0 0 / 0.15)',
      },

      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1rem' }],      // 12px
        'sm': ['0.875rem', { lineHeight: '1.25rem' }],  // 14px
        'base': ['1rem', { lineHeight: '1.5rem' }],     // 16px
        'lg': ['1.125rem', { lineHeight: '1.75rem' }],  // 18px
        'xl': ['1.25rem', { lineHeight: '1.75rem' }],   // 20px
        '2xl': ['1.5rem', { lineHeight: '2rem' }],      // 24px
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }], // 30px
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],   // 36px
      },

      fontWeight: {
        'normal': 400,
        'medium': 500,
        'semibold': 600,
        'bold': 700,
      },

      transitionDuration: {
        '150': '150ms',
        '200': '200ms',
        '300': '300ms',
        '500': '500ms',
      },

      zIndex: {
        'hide': '-1',
        'base': '0',
        'dropdown': '10',
        'sticky': '20',
        'fixed': '30',
        'backdrop': '40',
        'modal': '50',
        'tooltip': '60',
        'notification': '70',
      },

      animation: {
        'in': 'fadeIn 0.3s ease-in-out',
        'pulse': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },

      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
    },
  },

  plugins: [
    /**
     * Optional: Add these Tailwind plugins for more features
     * npm install -D @tailwindcss/forms @tailwindcss/typography
     */
    // require('@tailwindcss/forms'),
    // require('@tailwindcss/typography'),
  ],
};

/**
 * ============================================================================
 * SETUP INSTRUCTIONS
 * ============================================================================
 * 
 * 1. If you don't have Tailwind CSS installed:
 *    npm install -D tailwindcss postcss autoprefixer
 *    npx tailwindcss init -p
 * 
 * 2. Update your tailwind.config.js with the configuration above
 * 
 * 3. Make sure your CSS file has:
 *    @tailwind base;
 *    @tailwind components;
 *    @tailwind utilities;
 * 
 * 4. Verify Tailwind is working by using a simple class:
 *    <div className="bg-indigo-600">This should be indigo</div>
 * 
 * 5. Start using the design system colors and utilities!
 */

/**
 * ============================================================================
 * COLOR CLASSES AVAILABLE
 * ============================================================================
 * 
 * Background colors: bg-indigo-600, bg-emerald-600, bg-rose-500, etc.
 * Text colors: text-slate-900, text-slate-600, etc.
 * Border colors: border-slate-200, border-indigo-200, etc.
 * 
 * Examples:
 * <button className="bg-indigo-600 hover:bg-indigo-700 text-white">Primary</button>
 * <div className="bg-slate-50 border border-slate-200">Card</div>
 * <p className="text-slate-600">Secondary text</p>
 */

/**
 * ============================================================================
 * SPACING UTILITIES
 * ============================================================================
 * 
 * Padding:  p-4, p-6, px-4, py-2
 * Margin:   m-4, mb-6, mt-2, mx-auto
 * Gap:      gap-4, gap-6, space-y-4
 * Width:    w-full, w-1/2, w-96
 * Height:   h-12, h-full, h-screen
 * 
 * Examples:
 * <div className="p-6 space-y-4">          {/* 24px padding, 16px vertical gap */}
 * <button className="px-4 py-2">          {/* 16px horizontal, 8px vertical */}
 * <div className="mb-6">                   {/* 24px bottom margin */}
 */

/**
 * ============================================================================
 * RESPONSIVE UTILITIES
 * ============================================================================
 * 
 * Mobile-first approach:
 * sm: screens @640px
 * md: screens @768px
 * lg: screens @1024px
 * xl: screens @1280px
 * 2xl: screens @1536px
 * 
 * Examples:
 * <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
 * <button className="px-4 md:px-6 lg:px-8">
 * <div className="text-sm md:text-base lg:text-lg">
 */

/**
 * ============================================================================
 * HOVER & STATE UTILITIES
 * ============================================================================
 * 
 * Hover: hover:bg-indigo-700, hover:text-indigo-800
 * Focus: focus:outline-none, focus:ring-2, focus:ring-indigo-500
 * Active: active:scale-95
 * Disabled: disabled:opacity-50, disabled:cursor-not-allowed
 * 
 * Examples:
 * <button className="bg-indigo-600 hover:bg-indigo-700 active:scale-95">
 * <input className="focus:ring-2 focus:ring-indigo-500 focus:border-transparent">
 */

/**
 * ============================================================================
 * SHADOW UTILITIES
 * ============================================================================
 * 
 * shadow-sm:    Small shadow (cards)
 * shadow-base:  Base shadow (default)
 * shadow-md:    Medium shadow
 * shadow-lg:    Large shadow (modals)
 * shadow-xl:    Extra large shadow
 * shadow-hover: Custom shadow for hover states
 * 
 * Examples:
 * <div className="shadow-sm">Card</div>
 * <div className="hover:shadow-lg transition-all duration-200">Interactive</div>
 */

/**
 * ============================================================================
 * COMMON TAILWIND PATTERNS
 * ============================================================================
 */

export const COMMON_PATTERNS = {
  // Flex centering
  flexCenter: 'flex items-center justify-center',
  flexBetween: 'flex items-center justify-between',
  
  // Grid layouts
  gridAuto: 'grid auto-cols-fr gap-6',
  gridResponsive: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6',
  
  // Containers
  container: 'max-w-7xl mx-auto',
  section: 'bg-white rounded-xl shadow-sm border border-slate-100 p-6',
  
  // Text utilities
  truncate: 'truncate',
  ellipsis: 'line-clamp-2',
  
  // Focus states
  focusRing: 'focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-0',
  
  // Transitions
  transition: 'transition-all duration-200',
  transitionSlow: 'transition-all duration-300',
  
  // Disabled states
  disabled: 'disabled:opacity-50 disabled:cursor-not-allowed',
};

/**
 * ============================================================================
 * COLORS CHEAT SHEET
 * ============================================================================
 * 
 * INDIGO (#4F46E5) - Primary CTA
 *   Use for: main buttons, links, primary actions
 *   Classes: bg-indigo-600, text-indigo-600, border-indigo-200
 * 
 * EMERALD (#059669) - Success/Create
 *   Use for: create buttons, success messages, positive actions
 *   Classes: bg-emerald-600, text-emerald-600, border-emerald-200
 * 
 * ROSE (#F43F5E) - Danger/Delete
 *   Use for: delete buttons, error messages, destructive actions
 *   Classes: bg-rose-500, text-rose-600, border-rose-200
 * 
 * AMBER (#F59E0B) - Warning
 *   Use for: warnings, cautions, updates
 *   Classes: bg-amber-500, text-amber-600, border-amber-200
 * 
 * PURPLE (#9333EA) - Secondary
 *   Use for: teacher-related, secondary features
 *   Classes: bg-purple-600, text-purple-600, border-purple-200
 * 
 * SLATE (Various) - Neutral
 *   50: Very light background
 *   100: Light background
 *   200: Light borders
 *   300: Borders
 *   400: Muted text
 *   500: Secondary text
 *   600: Normal text
 *   700: Dark text
 *   800: Very dark
 *   900: Darkest (almost black)
 * 
 * CYAN (#0891B2) - Accent
 *   Use for: highlights, secondary accents
 *   Classes: bg-cyan-600, text-cyan-600, border-cyan-200
 */

/**
 * ============================================================================
 * COMMON MISTAKES TO AVOID
 * ============================================================================
 * 
 * ✗ DON'T: Mix multiple primary colors
 *   <button className="bg-blue-600">   ← Wrong
 *   <button className="bg-indigo-600"> ← Correct
 * 
 * ✗ DON'T: Use arbitrary spacing values
 *   <div className="p-7">              ← Wrong (use 8, 16, 24, 32...)
 *   <div className="p-6">              ← Correct (24px)
 * 
 * ✗ DON'T: Forget hover states
 *   <button className="bg-indigo-600">
 *   <button className="bg-indigo-600 hover:bg-indigo-700">  ← Add hover
 * 
 * ✗ DON'T: Use gray for everything
 *   Background: use slate-50 to slate-100
 *   Text: use slate-600 to slate-900
 *   Borders: use slate-200 to slate-300
 * 
 * ✗ DON'T: Create buttons without clear intent
 *   <button className="bg-slate-200">Click me</button>
 *   <button className="bg-indigo-600 text-white">Save</button>  ← Clear
 * 
 * ✓ DO: Use consistent transitions
 *   <button className="bg-indigo-600 hover:bg-indigo-700 transition-all duration-200">
 * 
 * ✓ DO: Stack shadow with interactions
 *   <div className="shadow-sm hover:shadow-lg transition-all duration-200">
 * 
 * ✓ DO: Use 4px-based spacing grid
 *   4px (xs), 8px (sm), 16px (md), 24px (lg), 32px (xl)
 */

/**
 * ============================================================================
 * USEFUL RESOURCES
 * ============================================================================
 * 
 * Tailwind CSS Documentation: https://tailwindcss.com/docs
 * Color Reference: https://tailwindcss.com/docs/customizing-colors
 * Spacing Reference: https://tailwindcss.com/docs/customizing-spacing
 * Responsive Design: https://tailwindcss.com/docs/responsive-design
 * 
 * VS Code Extension:
 * Install "Tailwind CSS IntelliSense" for autocomplete
 */
