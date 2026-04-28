/**
 * DESIGN SYSTEM - Complete UI/UX Guidelines
 * ==========================================
 * This file defines all design tokens, colors, spacing, typography, and component patterns
 * used throughout the Grade Sink application.
 * 
 * Last Updated: April 28, 2026
 */

// ============================================================================
// COLOR PALETTE - Modern & Professional
// ============================================================================
export const COLORS = {
  // Primary: Indigo - Main actions, CTAs, important elements
  primary: {
    50: '#EEF2FF',
    100: '#E0E7FF',
    200: '#C7D2FE',
    400: '#818CF8',
    500: '#6366F1',
    600: '#4F46E5', // Main primary color
    700: '#4338CA',
    800: '#3730A3',
    900: '#312E81',
  },

  // Success: Emerald - Create, add, positive actions
  success: {
    50: '#F0FDF4',
    100: '#DCFCE7',
    200: '#BBEF63',
    400: '#4ADE80',
    500: '#22C55E',
    600: '#059669', // Main success color
    700: '#047857',
    800: '#065F46',
    900: '#064E3B',
  },

  // Warning: Amber - Updates, cautions, modifications
  warning: {
    50: '#FFFBEB',
    100: '#FEF3C7',
    200: '#FDE68A',
    400: '#FBBF24',
    500: '#F59E0B', // Main warning color
    600: '#D97706',
    700: '#B45309',
    800: '#92400E',
    900: '#78350F',
  },

  // Danger: Rose - Delete, errors, destructive actions
  danger: {
    50: '#FFF5F7',
    100: '#FFE4E6',
    200: '#FECDD3',
    400: '#FB7185',
    500: '#F43F5E', // Main danger color
    600: '#E11D48',
    700: '#BE185D',
    800: '#9D174D',
    900: '#831843',
  },

  // Neutral: Slate - Text, backgrounds, borders
  neutral: {
    0: '#FFFFFF',
    50: '#F8FAFC',
    100: '#F1F5F9',
    200: '#E2E8F0',
    300: '#CBD5E1',
    400: '#94A3B8',
    500: '#64748B',
    600: '#475569', // Main text color
    700: '#334155',
    800: '#1E293B',
    900: '#0F172A',
  },

  // Secondary Brand: Purple - Teacher assignments, secondary features
  secondary: {
    50: '#FAF5FF',
    100: '#F3E8FF',
    200: '#E9D5FF',
    400: '#D8B4FE',
    500: '#C084FC',
    600: '#9333EA', // Main secondary color
    700: '#7E22CE',
    800: '#6B21A8',
    900: '#581C87',
  },

  // Accent: Cyan - Highlights, hover states
  accent: {
    50: '#ECFDFD',
    100: '#CFFAFE',
    200: '#A5F3FC',
    400: '#22D3EE',
    500: '#06B6D4',
    600: '#0891B2', // Main accent color
    700: '#0E7490',
    800: '#155E75',
    900: '#164E63',
  },
};

// ============================================================================
// SHADOW SYSTEM - Depth & Elevation
// ============================================================================
export const SHADOWS = {
  none: 'none',
  sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  base: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  hover: '0 10px 25px -5px rgb(0 0 0 / 0.15)',
};

// ============================================================================
// SPACING SCALE - Consistent padding/margin
// ============================================================================
export const SPACING = {
  xs: '0.25rem', // 4px
  sm: '0.5rem',  // 8px
  md: '1rem',    // 16px
  lg: '1.5rem',  // 24px
  xl: '2rem',    // 32px
  '2xl': '2.5rem', // 40px
  '3xl': '3rem',   // 48px
};

// ============================================================================
// BORDER RADIUS - Consistent roundedness
// ============================================================================
export const BORDER_RADIUS = {
  none: '0',
  sm: '0.25rem',   // 4px
  base: '0.375rem', // 6px
  md: '0.5rem',    // 8px
  lg: '0.75rem',   // 12px
  xl: '1rem',      // 16px
  full: '9999px',
};

// ============================================================================
// TYPOGRAPHY - Font styles and weights
// ============================================================================
export const TYPOGRAPHY = {
  // Headings
  h1: {
    fontSize: '2.25rem', // 36px
    fontWeight: 700,
    lineHeight: 1.2,
  },
  h2: {
    fontSize: '1.875rem', // 30px
    fontWeight: 700,
    lineHeight: 1.3,
  },
  h3: {
    fontSize: '1.5rem', // 24px
    fontWeight: 600,
    lineHeight: 1.4,
  },
  h4: {
    fontSize: '1.25rem', // 20px
    fontWeight: 600,
    lineHeight: 1.5,
  },

  // Body
  body_lg: {
    fontSize: '1.125rem', // 18px
    fontWeight: 400,
    lineHeight: 1.6,
  },
  body: {
    fontSize: '1rem', // 16px
    fontWeight: 400,
    lineHeight: 1.6,
  },
  body_sm: {
    fontSize: '0.875rem', // 14px
    fontWeight: 400,
    lineHeight: 1.5,
  },

  // Labels & Small Text
  label: {
    fontSize: '0.875rem', // 14px
    fontWeight: 500,
    lineHeight: 1.4,
  },
  caption: {
    fontSize: '0.75rem', // 12px
    fontWeight: 400,
    lineHeight: 1.4,
  },

  // Code
  code: {
    fontSize: '0.875rem', // 14px
    fontWeight: 500,
    fontFamily: "'Courier New', monospace",
  },
};

// ============================================================================
// TRANSITION & ANIMATION
// ============================================================================
export const TRANSITIONS = {
  fast: '150ms ease-in-out',
  base: '200ms ease-in-out',
  slow: '300ms ease-in-out',
  slowest: '500ms ease-in-out',
};

// ============================================================================
// COMPONENT PATTERNS - Ready-to-use Tailwind class combinations
// ============================================================================

// BUTTONS
export const BUTTON_STYLES = {
  // Primary Button (Indigo) - Main CTAs
  primary: 'bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-4 py-2 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed',

  // Secondary Button (Slate) - Secondary actions
  secondary: 'bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold px-4 py-2 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed',

  // Success Button (Emerald) - Create/Add actions
  success: 'bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-4 py-2 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed',

  // Warning Button (Amber) - Update/Modify actions
  warning: 'bg-amber-500 hover:bg-amber-600 text-white font-semibold px-4 py-2 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed',

  // Danger Button (Rose) - Delete actions
  danger: 'bg-rose-500 hover:bg-rose-600 text-white font-semibold px-4 py-2 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed',

  // Ghost Button (Icon buttons, minimal style)
  ghost: 'text-slate-600 hover:text-slate-800 hover:bg-slate-100 p-2 rounded-lg transition-all duration-200',

  // Small Button (Compact)
  small: 'px-3 py-1.5 text-sm font-medium rounded-md transition-all duration-200',

  // Large Button (Full width or prominent)
  large: 'w-full px-6 py-3 text-base font-semibold rounded-lg transition-all duration-200',
};

// CARDS
export const CARD_STYLES = {
  // Base Card - Standard elevation
  base: 'bg-white rounded-xl shadow-sm border border-slate-100 transition-all duration-200',

  // Hover Card - Interactive card with hover effect
  hover: 'bg-white rounded-xl shadow-sm border border-slate-100 hover:shadow-lg hover:border-indigo-200 transition-all duration-200 cursor-pointer',

  // Elevated Card - Higher elevation
  elevated: 'bg-white rounded-xl shadow-md border border-slate-100 transition-all duration-200',

  // Flat Card - No shadow, subtle border only
  flat: 'bg-white rounded-xl border border-slate-200 transition-all duration-200',

  // Success Card - Green accent
  success: 'bg-emerald-50 rounded-xl shadow-sm border border-emerald-200 transition-all duration-200',

  // Warning Card - Amber accent
  warning: 'bg-amber-50 rounded-xl shadow-sm border border-amber-200 transition-all duration-200',

  // Danger Card - Rose accent
  danger: 'bg-rose-50 rounded-xl shadow-sm border border-rose-200 transition-all duration-200',

  // Info Card - Indigo accent
  info: 'bg-indigo-50 rounded-xl shadow-sm border border-indigo-200 transition-all duration-200',
};

// FORM INPUTS
export const INPUT_STYLES = {
  // Base Input
  base: 'w-full px-4 py-2.5 border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200',

  // Input with Error
  error: 'w-full px-4 py-2.5 border-2 border-rose-500 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all duration-200',

  // Input Disabled
  disabled: 'w-full px-4 py-2.5 border border-slate-200 rounded-lg text-slate-400 bg-slate-50 cursor-not-allowed',

  // Small Input
  small: 'px-3 py-1.5 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent',

  // Large Input
  large: 'w-full px-5 py-3 border border-slate-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent',
};

// LABELS
export const LABEL_STYLES = {
  base: 'block text-sm font-semibold text-slate-700 mb-2',
  required: "block text-sm font-semibold text-slate-700 mb-2 after:content-['*'] after:text-rose-500 after:ml-1",
  help: 'block text-xs text-slate-500 mt-1',
};

// BADGES
export const BADGE_STYLES = {
  // Default Badge
  default: 'inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-slate-100 text-slate-800',

  // Primary Badge
  primary: 'inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-700',

  // Success Badge
  success: 'inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-emerald-100 text-emerald-700',

  // Warning Badge
  warning: 'inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-amber-100 text-amber-700',

  // Danger Badge
  danger: 'inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-rose-100 text-rose-700',

  // Pill Badge (larger)
  pill: 'inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-indigo-600 text-white',
};

// TABLES
export const TABLE_STYLES = {
  // Container
  container: 'w-full overflow-x-auto',

  // Table
  base: 'w-full text-sm text-left text-slate-600',

  // Header
  header: 'bg-slate-50 border-b border-slate-200 sticky top-0',
  headerCell: 'px-6 py-3 font-semibold text-slate-700 text-sm uppercase tracking-wide',

  // Body
  body: 'divide-y divide-slate-200',
  row: 'hover:bg-slate-50 transition-colors duration-150 border-b border-slate-100',
  cell: 'px-6 py-4 text-slate-900',

  // Striped (alternate row colors)
  striped: 'bg-slate-50',

  // Highlight
  highlight: 'bg-indigo-50',
};

// MODALS / DIALOGS
export const MODAL_STYLES = {
  // Backdrop/Overlay
  overlay: 'fixed inset-0 bg-slate-900/50 z-40 transition-opacity duration-200',

  // Container
  container: 'fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-300',

  // Modal Box
  box: 'relative bg-white rounded-2xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto transition-all duration-300',

  // Modal Box (Large)
  boxLarge: 'relative bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto transition-all duration-300',

  // Header
  header: 'sticky top-0 bg-white px-6 py-4 border-b border-slate-200 flex items-center justify-between',

  // Body
  body: 'px-6 py-4',

  // Footer
  footer: 'sticky bottom-0 bg-slate-50 px-6 py-4 border-t border-slate-200 flex justify-end gap-3',
};

// ALERTS
export const ALERT_STYLES = {
  // Info Alert (Blue)
  info: 'bg-indigo-50 border border-indigo-200 rounded-lg p-4 text-indigo-800',

  // Success Alert (Green)
  success: 'bg-emerald-50 border border-emerald-200 rounded-lg p-4 text-emerald-800',

  // Warning Alert (Amber)
  warning: 'bg-amber-50 border border-amber-200 rounded-lg p-4 text-amber-800',

  // Danger Alert (Rose)
  danger: 'bg-rose-50 border border-rose-200 rounded-lg p-4 text-rose-800',
};

// NAVIGATION
export const NAV_STYLES = {
  // Sidebar
  sidebar: 'bg-slate-900 text-white w-64 min-h-screen flex flex-col shadow-lg',
  sidebarItem: 'px-4 py-3 hover:bg-slate-800 rounded-lg transition-colors duration-200 flex items-center gap-3',
  sidebarItemActive: 'px-4 py-3 bg-indigo-600 rounded-lg flex items-center gap-3 font-semibold',

  // Top Navigation
  topNav: 'bg-white border-b border-slate-200 px-6 py-4 shadow-sm sticky top-0 z-20',

  // Breadcrumb
  breadcrumb: 'flex items-center gap-2 text-sm text-slate-600',
};

// LOADING STATES
export const LOADING_STYLES = {
  // Spinner
  spinner: 'animate-spin inline-block w-5 h-5 border-2 border-indigo-600 border-t-transparent rounded-full',

  // Skeleton (Placeholder)
  skeleton: 'bg-gradient-to-r from-slate-200 to-slate-100 animate-pulse rounded-lg',

  // Progress Bar
  progress: 'h-2 bg-slate-200 rounded-full overflow-hidden',
  progressFill: 'h-full bg-indigo-600 transition-all duration-300',
};

// ============================================================================
// Z-INDEX SCALE
// ============================================================================
export const Z_INDEX = {
  hide: -1,
  base: 0,
  dropdown: 10,
  sticky: 20,
  fixed: 30,
  backdrop: 40,
  modal: 50,
  tooltip: 60,
  notification: 70,
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Get color by status type
 */
export function getStatusColor(status: 'success' | 'warning' | 'danger' | 'info'): string {
  const colors: Record<string, string> = {
    success: COLORS.success[600],
    warning: COLORS.warning[500],
    danger: COLORS.danger[500],
    info: COLORS.primary[600],
  };
  return colors[status] || colors.info;
}

/**
 * Get button style by variant
 */
export function getButtonClass(
  variant: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'ghost' = 'primary',
  size: 'small' | 'base' | 'large' = 'base'
): string {
  let baseClass = BUTTON_STYLES[variant];
  if (size === 'small') {
    baseClass += ' ' + BUTTON_STYLES.small;
  } else if (size === 'large') {
    baseClass += ' ' + BUTTON_STYLES.large;
  }
  return baseClass;
}

/**
 * Get card style by variant
 */
export function getCardClass(variant: 'base' | 'hover' | 'elevated' | 'success' | 'warning' | 'danger' | 'info' = 'base'): string {
  return CARD_STYLES[variant];
}

/**
 * Get alert style by type
 */
export function getAlertClass(type: 'info' | 'success' | 'warning' | 'danger' = 'info'): string {
  return ALERT_STYLES[type];
}
