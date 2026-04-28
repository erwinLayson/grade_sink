/**
 * REUSABLE COMPONENT PATTERNS
 * ============================
 * Pre-built, styled component patterns ready to use throughout the application.
 * Copy-paste snippets with proper Tailwind classes and structure.
 */

// ============================================================================
// BUTTON COMPONENTS
// ============================================================================

/**
 * Primary Button (Main CTA)
 * Usage: <button className={btnPrimary}>Create</button>
 */
export const btnPrimary = 'bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-4 py-2 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed active:scale-95';

/**
 * Secondary Button
 */
export const btnSecondary = 'bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold px-4 py-2 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95';

/**
 * Success Button (Create/Add)
 */
export const btnSuccess = 'bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-4 py-2 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed active:scale-95';

/**
 * Danger Button (Delete)
 */
export const btnDanger = 'bg-rose-500 hover:bg-rose-600 text-white font-semibold px-4 py-2 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed active:scale-95';

/**
 * Icon Button (Ghost style for minimal UI)
 */
export const btnIcon = 'text-slate-600 hover:text-slate-800 hover:bg-slate-100 p-2 rounded-lg transition-all duration-200';

/**
 * Full Width Button (Forms)
 */
export const btnBlock = 'w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-4 py-3 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed';

// ============================================================================
// CARD PATTERNS
// ============================================================================

/**
 * Standard Card
 * <div className={cardBase}>
 *   Content here
 * </div>
 */
export const cardBase = 'bg-white rounded-xl shadow-sm border border-slate-100 transition-all duration-200 overflow-hidden';

/**
 * Interactive Card (with hover effect)
 */
export const cardHover = 'bg-white rounded-xl shadow-sm border border-slate-100 hover:shadow-lg hover:border-indigo-200 transition-all duration-200 cursor-pointer';

/**
 * Card with padding
 */
export const cardPadded = 'bg-white rounded-xl shadow-sm border border-slate-100 p-6 transition-all duration-200';

/**
 * Status cards (colored variants)
 */
export const cardSuccess = 'bg-emerald-50 border border-emerald-200 rounded-lg p-4';
export const cardWarning = 'bg-amber-50 border border-amber-200 rounded-lg p-4';
export const cardError = 'bg-rose-50 border border-rose-200 rounded-lg p-4';
export const cardInfo = 'bg-indigo-50 border border-indigo-200 rounded-lg p-4';

// ============================================================================
// FORM PATTERNS
// ============================================================================

/**
 * Form Input
 * <input className={inputBase} type="text" placeholder="Enter text" />
 */
export const inputBase = 'w-full px-4 py-2.5 border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200';

/**
 * Form Input (Error state)
 */
export const inputError = 'w-full px-4 py-2.5 border-2 border-rose-500 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent bg-rose-50';

/**
 * Form Select
 */
export const selectBase = 'w-full px-4 py-2.5 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 appearance-none cursor-pointer bg-white';

/**
 * Form Label
 * <label className={labelBase}>Field Label *</label>
 */
export const labelBase = 'block text-sm font-semibold text-slate-700 mb-2';

/**
 * Label with required indicator
 */
export const labelRequired = "block text-sm font-semibold text-slate-700 mb-2 after:content-['*'] after:text-rose-500 after:ml-1";

/**
 * Form Group (label + input wrapper)
 */
export const formGroup = 'mb-4';

/**
 * Help text under input
 */
export const helpText = 'text-xs text-slate-500 mt-1';

/**
 * Error message under input
 */
export const errorText = 'text-xs text-rose-600 font-medium mt-1';

// ============================================================================
// TABLE PATTERNS
// ============================================================================

/**
 * Table wrapper
 * <div className={tableWrapper}>
 *   <table className={tableBase}>
 */
export const tableWrapper = 'w-full overflow-x-auto rounded-lg border border-slate-200';

/**
 * Table element
 */
export const tableBase = 'w-full text-sm text-left text-slate-600';

/**
 * Table header
 */
export const thBase = 'px-6 py-4 bg-slate-50 border-b border-slate-200 font-semibold text-slate-700 text-xs uppercase tracking-wide';

/**
 * Table row
 */
export const trBase = 'border-b border-slate-200 hover:bg-slate-50 transition-colors duration-150';

/**
 * Table cell
 */
export const tdBase = 'px-6 py-4 text-slate-900';

/**
 * Striped table row (alternate)
 */
export const trStriped = 'border-b border-slate-200 hover:bg-slate-50 transition-colors duration-150 odd:bg-slate-50';

// ============================================================================
// BADGE PATTERNS
// ============================================================================

/**
 * Inline badge
 */
export const badgeDefault = 'inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-800';
export const badgePrimary = 'inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-700';
export const badgeSuccess = 'inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700';
export const badgeWarning = 'inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-700';
export const badgeDanger = 'inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-rose-100 text-rose-700';

/**
 * Large badge/pill
 */
export const badgePill = 'inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-indigo-600 text-white';

// ============================================================================
// MODAL PATTERNS
// ============================================================================

/**
 * Modal overlay (backdrop)
 * <div className={modalOverlay}>
 *   <div className={modalBox}>
 */
export const modalOverlay = 'fixed inset-0 bg-slate-900/50 z-40 transition-opacity duration-300';

/**
 * Modal box
 */
export const modalBox = 'relative bg-white rounded-2xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto transition-all duration-300';

/**
 * Modal header
 */
export const modalHeader = 'sticky top-0 bg-white px-6 py-4 border-b border-slate-200 flex items-center justify-between';

/**
 * Modal title
 */
export const modalTitle = 'text-xl font-bold text-slate-900';

/**
 * Modal body
 */
export const modalBody = 'px-6 py-4 space-y-4';

/**
 * Modal footer
 */
export const modalFooter = 'sticky bottom-0 bg-slate-50 px-6 py-4 border-t border-slate-200 flex justify-end gap-3';

// ============================================================================
// ALERT PATTERNS
// ============================================================================

/**
 * Alert boxes (inline messages)
 */
export const alertInfo = 'bg-indigo-50 border border-indigo-200 rounded-lg p-4 text-indigo-800';
export const alertSuccess = 'bg-emerald-50 border border-emerald-200 rounded-lg p-4 text-emerald-800';
export const alertWarning = 'bg-amber-50 border border-amber-200 rounded-lg p-4 text-amber-800';
export const alertError = 'bg-rose-50 border border-rose-200 rounded-lg p-4 text-rose-800';

// ============================================================================
// LOADING PATTERNS
// ============================================================================

/**
 * Spinner (loading indicator)
 * <div className={spinner}></div>
 */
export const spinner = 'animate-spin inline-block w-5 h-5 border-2 border-indigo-600 border-t-transparent rounded-full';

/**
 * Skeleton loader (placeholder)
 */
export const skeleton = 'bg-gradient-to-r from-slate-200 to-slate-100 animate-pulse rounded-lg';

/**
 * Progress bar
 * <div className={progressBar}>
 *   <div className={progressFill} style={{width: '65%'}}></div>
 * </div>
 */
export const progressBar = 'h-2 bg-slate-200 rounded-full overflow-hidden';
export const progressFill = 'h-full bg-indigo-600 transition-all duration-300';

// ============================================================================
// LAYOUT PATTERNS
// ============================================================================

/**
 * Page header
 */
export const pageHeader = 'mb-8';
export const pageTitle = 'text-4xl font-bold text-slate-900 mb-2';
export const pageSubtitle = 'text-lg text-slate-600';

/**
 * Section with white background
 */
export const section = 'bg-white rounded-xl shadow-sm border border-slate-100 p-6 mb-6';

/**
 * Grid layouts
 */
export const gridResponsive = 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6';
export const gridResponsive2 = 'grid grid-cols-1 lg:grid-cols-2 gap-6';
export const gridResponsiveFull = 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6';

/**
 * Flex layouts
 */
export const flexBetween = 'flex items-center justify-between';
export const flexCenter = 'flex items-center justify-center';
export const flexCol = 'flex flex-col';

/**
 * Divider
 */
export const divider = 'h-px bg-slate-200 my-4';

// ============================================================================
// TEXT PATTERNS
// ============================================================================

/**
 * Text utilities
 */
export const textMuted = 'text-slate-500';
export const textSecondary = 'text-slate-600';
export const textDanger = 'text-rose-600';
export const textSuccess = 'text-emerald-600';

/**
 * Text sizes
 */
export const textXs = 'text-xs';
export const textSm = 'text-sm';
export const textBase = 'text-base';
export const textLg = 'text-lg';
export const textXl = 'text-xl';
export const text2xl = 'text-2xl';

/**
 * Text weights
 */
export const fontRegular = 'font-normal';
export const fontMedium = 'font-medium';
export const fontSemibold = 'font-semibold';
export const fontBold = 'font-bold';

// ============================================================================
// SPACING PATTERNS
// ============================================================================

/**
 * Common spacing combinations
 */
export const spacingXs = 'space-y-2';
export const spacingSm = 'space-y-3';
export const spacingMd = 'space-y-4';
export const spacingLg = 'space-y-6';
export const spacingXl = 'space-y-8';

// ============================================================================
// TRANSITION PATTERNS
// ============================================================================

/**
 * Common transitions
 */
export const transitionFast = 'transition-all duration-150';
export const transitionBase = 'transition-all duration-200';
export const transitionSlow = 'transition-all duration-300';

// ============================================================================
// UTILITY COMBINATIONS
// ============================================================================

/**
 * Search input (with icon placeholder)
 */
export const searchInput = 'w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent';

/**
 * Disabled input
 */
export const inputDisabled = 'w-full px-4 py-2.5 border border-slate-200 rounded-lg text-slate-400 bg-slate-50 cursor-not-allowed';

/**
 * Link button (no background)
 */
export const linkButton = 'text-indigo-600 hover:text-indigo-700 font-semibold transition-colors duration-200';

/**
 * Breadcrumb link
 */
export const breadcrumbLink = 'text-slate-600 hover:text-slate-900 transition-colors duration-200';

/**
 * Empty state (centered content)
 */
export const emptyState = 'flex flex-col items-center justify-center py-12 text-center';

/**
 * Container for forms
 */
export const formContainer = 'space-y-4';

/**
 * Button group
 */
export const btnGroup = 'flex gap-3';
export const btnGroupBlock = 'flex flex-col gap-2';

/**
 * Action row (button group with spacing)
 */
export const actionRow = 'flex items-center justify-between gap-4 pt-6 border-t border-slate-200 mt-6';
