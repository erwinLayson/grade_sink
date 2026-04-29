/**
 * ============================================================================
 * DESIGN SYSTEM IMPLEMENTATION GUIDE
 * ============================================================================
 * 
 * A comprehensive guide to implementing the Grade Sink modern UI design system.
 * This file contains patterns, examples, and best practices.
 * 
 * Last Updated: April 28, 2026
 */

// ============================================================================
// TABLE OF CONTENTS
// ============================================================================

/**
 * 1. SETUP & INSTALLATION
 * 2. COLOR SYSTEM
 * 3. TYPOGRAPHY
 * 4. SPACING & LAYOUT
 * 5. COMPONENTS
 * 6. FORMS
 * 7. TABLES & DATA DISPLAY
 * 8. MODALS & DIALOGS
 * 9. NOTIFICATIONS & FEEDBACK
 * 10. ANIMATIONS & TRANSITIONS
 * 11. BEST PRACTICES
 * 12. COMMON PATTERNS
 * 13. ACCESSIBILITY
 * 14. MIGRATION GUIDE
 */

// ============================================================================
// 1. SETUP & INSTALLATION
// ============================================================================

/**
 * SETUP STEPS:
 * 
 * 1. Import the design system in your component:
 *    import { COLORS, BUTTON_STYLES } from '@/constants/designSystem';
 *    import * as patterns from '@/constants/componentPatterns';
 * 
 * 2. Wrap your app with ToastProvider (in main.tsx):
 *    import { ToastProvider } from '@/context/ToastContext';
 *    
 *    <ToastProvider>
 *      <App />
 *    </ToastProvider>
 * 
 * 3. Start using design tokens and component patterns in your components!
 */

// ============================================================================
// 2. COLOR SYSTEM
// ============================================================================

/**
 * COLOR USAGE GUIDE:
 * 
 * Indigo-600 (#4F46E5): Primary CTAs, important buttons, links
 * Emerald-600 (#059669): Success, create/add actions, positive feedback
 * Amber-500 (#F59E0B): Warnings, updates, cautions
 * Rose-500 (#F43F5E): Errors, delete, destructive actions
 * Purple-600 (#9333EA): Secondary features, teacher-related items
 * Slate-900: Main text, dark content
 * Slate-600: Secondary text, descriptions
 * Slate-200: Borders, dividers
 */

// EXAMPLE: Using colors in a component
export function ColorExample() {
  return (
    <div>
      {/* Primary action */}
      <button style={{ backgroundColor: '#4F46E5' }}>
        Create New
      </button>

      {/* Success message */}
      <div style={{ borderColor: '#059669', color: '#059669' }}>
        Item created successfully
      </div>

      {/* Error state */}
      <input style={{ borderColor: '#F43F5E' }} />

      {/* Secondary/muted text */}
      <p style={{ color: '#64748B' }}>Helper text</p>
    </div>
  );
}

// ============================================================================
// 3. TYPOGRAPHY
// ============================================================================

/**
 * TYPOGRAPHY HIERARCHY:
 * 
 * Page Headings:     h1 - 36px, 700 weight    (Page titles)
 * Section Headings:  h2 - 30px, 700 weight    (Main sections)
 * Subsections:       h3 - 24px, 600 weight    (Subsection titles)
 * Card Titles:       h4 - 20px, 600 weight    (Card/modal titles)
 * 
 * Body Text:         16px, 400 weight, 1.6 line-height
 * Secondary Text:    14px, 400 weight         (Helper text)
 * Labels:            14px, 500 weight         (Form labels)
 * Captions:          12px, 400 weight         (Small text)
 */

// EXAMPLE: Typography usage
export function TypographyExample() {
  return (
    <div>
      {/* Page title */}
      <h1 className="text-4xl font-bold text-slate-900 mb-2">
        Manage Classes
      </h1>

      {/* Description */}
      <p className="text-lg text-slate-600 mb-8">
        Add and manage classes with students and subjects
      </p>

      {/* Card title */}
      <h3 className="text-xl font-semibold text-slate-900">
        Class Details
      </h3>

      {/* Body text */}
      <p className="text-base text-slate-700 leading-relaxed">
        This is standard body text that should be easy to read.
      </p>

      {/* Secondary text */}
      <p className="text-sm text-slate-600">
        This is helper or secondary text
      </p>

      {/* Form label */}
      <label className="text-sm font-semibold text-slate-700">
        Class Name *
      </label>
    </div>
  );
}

// ============================================================================
// 4. SPACING & LAYOUT
// ============================================================================

/**
 * SPACING SCALE:
 * xs: 4px   (tight spacing)
 * sm: 8px   (small spacing)
 * md: 16px  (standard spacing)
 * lg: 24px  (larger spacing)
 * xl: 32px  (section spacing)
 * 2xl: 40px (large sections)
 * 3xl: 48px (major sections)
 * 
 * SPACING RULE:
 * - Use consistent spacing (multiples of 4px)
 * - Increase spacing for larger sections
 * - Decrease spacing for compact cards/items
 */

// EXAMPLE: Spacing usage
export function SpacingExample() {
  return (
    <div className="p-6 space-y-6">
      {/* Major section with xl spacing */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Section Title</h2>
        
        {/* Cards with md spacing */}
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-lg">Card 1</div>
          <div className="bg-white p-4 rounded-lg">Card 2</div>
        </div>
      </div>

      {/* Form with md spacing between inputs */}
      <form className="space-y-4">
        <div>
          <label className="text-sm font-semibold">Field 1</label>
          <input className="w-full mt-2" />
        </div>
        <div>
          <label className="text-sm font-semibold">Field 2</label>
          <input className="w-full mt-2" />
        </div>
      </form>
    </div>
  );
}

// ============================================================================
// 5. COMPONENTS - BUTTONS
// ============================================================================

/**
 * BUTTON VARIANTS:
 * 
 * Primary:   Main CTAs, important actions (indigo)
 * Success:   Create/add actions (emerald)
 * Warning:   Updates, modifications (amber)
 * Danger:    Delete, destructive (rose)
 * Secondary: Alternate actions (slate)
 * Ghost:     Icon buttons, minimal (no background)
 */

// EXAMPLE: Button usage
export function ButtonExample() {
  return (
    <div className="space-y-4">
      {/* Primary button */}
      <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-4 py-2 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md">
        Create New
      </button>

      {/* Success button (create/add) */}
      <button className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-4 py-2 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md">
        Add Item
      </button>

      {/* Danger button (delete) */}
      <button className="bg-rose-500 hover:bg-rose-600 text-white font-semibold px-4 py-2 rounded-lg transition-all duration-200">
        Delete
      </button>

      {/* Icon button (ghost) */}
      <button className="text-slate-600 hover:text-slate-800 hover:bg-slate-100 p-2 rounded-lg transition-all duration-200">
        <span>🔍</span>
      </button>

      {/* Full width button (forms) */}
      <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-4 py-3 rounded-lg transition-all duration-200">
        Submit Form
      </button>

      {/* Disabled button */}
      <button disabled className="bg-slate-300 text-slate-500 px-4 py-2 rounded-lg opacity-50 cursor-not-allowed">
        Disabled
      </button>
    </div>
  );
}

// ============================================================================
// 6. COMPONENTS - CARDS
// ============================================================================

/**
 * CARD VARIANTS:
 * 
 * Standard:  Basic card with subtle shadow
 * Hover:     Interactive card with hover effect
 * Elevated:  More prominent shadow
 * Flat:      No shadow, border only
 * Success:   Green background for positive content
 * Warning:   Amber background for cautions
 * Danger:    Rose background for alerts
 * Info:      Indigo background for information
 */

// EXAMPLE: Card usage
export function CardExample() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
      {/* Standard card */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-2">
          Class Name
        </h3>
        <p className="text-slate-600">Section A • Grade 10</p>
        <div className="mt-4 p-3 bg-purple-50 rounded-lg">
          <p className="text-2xl font-bold text-purple-600">24</p>
          <p className="text-xs text-slate-600">Students</p>
        </div>
      </div>

      {/* Interactive card */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 hover:shadow-lg hover:border-indigo-200 transition-all duration-200 cursor-pointer p-6">
        <h3 className="text-lg font-semibold text-slate-900">
          Clickable Card
        </h3>
        <p className="text-slate-600">Click me for details</p>
      </div>

      {/* Status cards */}
      <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
        <p className="text-sm font-semibold text-emerald-800">
          ✓ Success message
        </p>
      </div>

      <div className="bg-rose-50 border border-rose-200 rounded-lg p-4">
        <p className="text-sm font-semibold text-rose-800">
          ✗ Error message
        </p>
      </div>
    </div>
  );
}

// ============================================================================
// 7. FORMS
// ============================================================================

/**
 * FORM BEST PRACTICES:
 * 
 * 1. Always use labels with inputs
 * 2. Use required indicator (*) for mandatory fields
 * 3. Show error states with red border and background
 * 4. Display help text in small gray text
 * 5. Use consistent input heights and padding
 * 6. Group related inputs with space-y-4
 * 7. Show validation errors inline, not in alerts
 */

// EXAMPLE: Form usage
export function FormExample() {
  const [formData, setFormData] = React.useState({ email: '' });
  const [errors, setErrors] = React.useState<Record<string, string>>({});

  return (
    <form className="max-w-md space-y-4">
      {/* Standard input */}
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-2">
          Class Name *
        </label>
        <input
          type="text"
          placeholder="e.g., Section A"
          className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
        />
        <p className="text-xs text-slate-500 mt-1">
          Enter a unique class identifier
        </p>
      </div>

      {/* Input with error */}
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-2">
          Email *
        </label>
        <input
          type="email"
          className="w-full px-4 py-2.5 border-2 border-rose-500 rounded-lg text-slate-900 bg-rose-50 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent"
          value={formData.email}
        />
        {errors.email && (
          <p className="text-xs text-rose-600 font-medium mt-1">
            {errors.email}
          </p>
        )}
      </div>

      {/* Select input */}
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-2">
          Class Adviser *
        </label>
        <select className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent appearance-none bg-white">
          <option>Select an adviser</option>
          <option>John Doe</option>
          <option>Jane Smith</option>
        </select>
      </div>

      {/* Textarea */}
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-2">
          Notes
        </label>
        <textarea
          rows={4}
          className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          placeholder="Add any notes..."
        />
      </div>

      {/* Form actions */}
      <div className="flex gap-3 pt-6 border-t border-slate-200">
        <button className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-4 py-2 rounded-lg transition-all duration-200">
          Save Changes
        </button>
        <button className="flex-1 bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold px-4 py-2 rounded-lg transition-all duration-200">
          Cancel
        </button>
      </div>
    </form>
  );
}

// ============================================================================
// 8. TABLES & DATA DISPLAY
// ============================================================================

/**
 * TABLE BEST PRACTICES:
 * 
 * 1. Use consistent cell padding (px-6 py-4)
 * 2. Highlight headers with bg-slate-50
 * 3. Add hover effect to rows
 * 4. Use borders between rows only
 * 5. Align numbers to the right
 * 6. Keep stripe patterns optional but helpful
 * 7. Include action buttons in last column
 */

// EXAMPLE: Table usage
export function TableExample() {
  return (
    <div className="w-full overflow-x-auto rounded-lg border border-slate-200">
      <table className="w-full text-sm text-left text-slate-600">
        <thead className="bg-slate-50 border-b border-slate-200">
          <tr>
            <th className="px-6 py-4 font-semibold text-slate-700 text-xs uppercase tracking-wide">
              Student Name
            </th>
            <th className="px-6 py-4 font-semibold text-slate-700 text-xs uppercase tracking-wide">
              ID
            </th>
            <th className="px-6 py-4 font-semibold text-slate-700 text-xs uppercase tracking-wide">
              Gender
            </th>
            <th className="px-6 py-4 font-semibold text-slate-700 text-xs uppercase tracking-wide text-center">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200">
          {/* Sample rows */}
          {[1, 2, 3].map((i) => (
            <tr key={i} className="hover:bg-slate-50 transition-colors duration-150 border-b border-slate-100">
              <td className="px-6 py-4 text-slate-900">John Doe</td>
              <td className="px-6 py-4">STU00{i}</td>
              <td className="px-6 py-4">Male</td>
              <td className="px-6 py-4">
                <div className="flex justify-center gap-3">
                  <button className="text-blue-600 hover:text-blue-800">
                    Edit
                  </button>
                  <button className="text-red-600 hover:text-red-800">
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ============================================================================
// 9. MODALS & DIALOGS
// ============================================================================

/**
 * MODAL BEST PRACTICES:
 * 
 * 1. Use semi-transparent overlay (bg-slate-900/50)
 * 2. Center modal on screen
 * 3. Max width around max-w-md (400px)
 * 4. Sticky header and footer
 * 5. Scrollable body for long content
 * 6. Include close button (X icon)
 * 7. Clear button hierarchy in footer
 */

// EXAMPLE: Modal usage
export function ModalExample() {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-4 py-2 rounded-lg"
      >
        Open Modal
      </button>

      {/* Modal overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-slate-900/50 z-40 transition-opacity duration-300" />
      )}

      {/* Modal box */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="relative bg-white rounded-2xl shadow-xl max-w-md w-full">
            {/* Header */}
            <div className="sticky top-0 bg-white px-6 py-4 border-b border-slate-200 flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900">
                Create Class
              </h2>
              <button
                onClick={() => setIsOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-xl"
              >
                ✕
              </button>
            </div>

            {/* Body */}
            <div className="px-6 py-4 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Class Name *
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="e.g., Section A"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Grade Level *
                </label>
                <select className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent">
                  <option>Grade 9</option>
                  <option>Grade 10</option>
                </select>
              </div>
            </div>

            {/* Footer */}
            <div className="sticky bottom-0 bg-slate-50 px-6 py-4 border-t border-slate-200 flex justify-end gap-3">
              <button
                onClick={() => setIsOpen(false)}
                className="bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold px-4 py-2 rounded-lg transition-all duration-200"
              >
                Cancel
              </button>
              <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-4 py-2 rounded-lg transition-all duration-200">
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// ============================================================================
// 10. NOTIFICATIONS - REPLACE alert() WITH TOAST
// ============================================================================

/**
 * TOAST NOTIFICATIONS (Modern alternative to alert boxes)
 * 
 * Instead of:  alert('Item created successfully');
 * Use:         toast.success('Item created successfully');
 * 
 * Toast types:
 * - success: Green background (emerald)
 * - error:   Red background (rose)
 * - warning: Amber background
 * - info:    Blue background (indigo)
 * 
 * Features:
 * - Auto-closes after 4 seconds
 * - Can be manually dismissed
 * - Shows with smooth animation
 * - Appears in bottom-right corner
 * - Multiple toasts stack vertically
 */

// EXAMPLE: Toast usage
export function ToastExample() {
  const { addToast } = useToast(); // Requires ToastProvider
  // Or use the helper hook:
  const toast = useToastHelper();

  return (
    <div className="space-y-2">
      <button
        onClick={() => toast.success('Item created successfully!')}
        className="bg-emerald-600 text-white px-4 py-2 rounded-lg"
      >
        Show Success
      </button>

      <button
        onClick={() => toast.error('Something went wrong!')}
        className="bg-rose-600 text-white px-4 py-2 rounded-lg"
      >
        Show Error
      </button>

      <button
        onClick={() => toast.warning('Please review this')}
        className="bg-amber-500 text-white px-4 py-2 rounded-lg"
      >
        Show Warning
      </button>

      <button
        onClick={() => toast.info('Here is some information')}
        className="bg-indigo-600 text-white px-4 py-2 rounded-lg"
      >
        Show Info
      </button>

      {/* Toast with action button */}
      <button
        onClick={() =>
          addToast({
            type: 'info',
            message: 'Undo this action?',
            action: {
              label: 'Undo',
              onClick: () => console.log('Undone'),
            },
          })
        }
        className="bg-indigo-600 text-white px-4 py-2 rounded-lg"
      >
        Show with Action
      </button>
    </div>
  );
}

// ============================================================================
// 11. ANIMATIONS & TRANSITIONS
// ============================================================================

/**
 * ANIMATION GUIDELINES:
 * 
 * Fast (150ms):  Hover states, small interactions
 * Normal (200ms): Color changes, size changes
 * Slow (300ms):  Modal enters/exits, page transitions
 * Slowest (500ms): Complex animations, keyframe sequences
 * 
 * Keep animations subtle. Avoid excessive motion.
 */

// EXAMPLE: Animation usage
export function AnimationExample() {
  return (
    <div className="space-y-4">
      {/* Hover scale */}
      <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-lg hover:scale-105 transition-all duration-200 cursor-pointer">
        Hover for scale effect
      </div>

      {/* Fade transition */}
      <div className="bg-white p-6 rounded-lg opacity-0 animate-in fade-in duration-300">
        Fades in on load
      </div>

      {/* Slide transition */}
      <div className="bg-white p-6 rounded-lg animate-in slide-in-from-right duration-300">
        Slides in from right
      </div>

      {/* Color transition */}
      <button className="px-4 py-2 bg-slate-200 text-slate-800 rounded-lg hover:bg-indigo-600 hover:text-white transition-all duration-200">
        Color change on hover
      </button>

      {/* Spinner animation */}
      <div className="flex items-center gap-2">
        <div className="animate-spin inline-block w-5 h-5 border-2 border-indigo-600 border-t-transparent rounded-full" />
        <span>Loading...</span>
      </div>
    </div>
  );
}

// ============================================================================
// 12. BEST PRACTICES SUMMARY
// ============================================================================

/**
 * ✓ DO:
 * 1. Use consistent spacing (multiples of 4px)
 * 2. Use color for status/meaning (emerald=success, rose=danger, etc.)
 * 3. Provide hover states for interactive elements
 * 4. Use shadows for elevation/depth
 * 5. Keep modals centered and focused
 * 6. Use toast notifications instead of alert()
 * 7. Validate forms inline with clear error messages
 * 8. Use semantic HTML (button, input, select, etc.)
 * 9. Include focus states for keyboard navigation
 * 10. Test with different screen sizes (responsive)
 * 
 * ✗ DON'T:
 * 1. Mix different color brands (indigo vs purple for primary)
 * 2. Use arbitrary spacing values (1px, 3px, 7px)
 * 3. Forget hover/focus states
 * 4. Use bland grays everywhere
 * 5. Create modal content without scroll handling
 * 6. Use global alert() for feedback
 * 7. Create forms without labels
 * 8. Make buttons unclear (always add text, not just icons)
 * 9. Forget about mobile/responsive design
 * 10. Copy existing inconsistent styles
 */

// ============================================================================
// 13. MIGRATION GUIDE
// ============================================================================

/**
 * STEP 1: Update imports in pages
 * 
 * OLD:
 * import { FaPlus } from 'react-icons/fa';
 * 
 * NEW:
 * import { FaPlus } from 'react-icons/fa';
 * import { COLORS, BUTTON_STYLES } from '@/constants/designSystem';
 * import { useToastHelper } from '@/context/ToastContext';
 */

/**
 * STEP 2: Replace alert() with toast
 * 
 * OLD:
 * try {
 *   await axios.post(...);
 *   alert('Item created successfully');
 * } catch (e) {
 *   alert('Error: ' + error);
 * }
 * 
 * NEW:
 * const toast = useToastHelper();
 * 
 * try {
 *   await axios.post(...);
 *   toast.success('Item created successfully');
 * } catch (e) {
 *   toast.error(e.response?.data?.msg || 'Something went wrong');
 * }
 */

/**
 * STEP 3: Update button styles
 * 
 * OLD:
 * <button className="bg-blue-600 hover:bg-blue-700 text-white ...">
 *   Create
 * </button>
 * 
 * NEW:
 * <button className={BUTTON_STYLES.primary}>
 *   Create
 * </button>
 */

/**
 * STEP 4: Update card styles
 * 
 * OLD:
 * <div className="bg-white shadow-md ...">
 * 
 * NEW:
 * <div className={getCardClass('hover')}>
 */

// ============================================================================
// 14. FILE REFERENCES
// ============================================================================

/**
 * Files included in the design system:
 * 
 * 1. /constants/designSystem.ts
 *    - Color palette (COLORS object)
 *    - Shadow system (SHADOWS)
 *    - Spacing scale (SPACING)
 *    - Typography (TYPOGRAPHY)
 *    - Z-index scale (Z_INDEX)
 *    - Button styles (BUTTON_STYLES)
 *    - Card styles (CARD_STYLES)
 *    - And more...
 * 
 * 2. /constants/componentPatterns.ts
 *    - Ready-to-use Tailwind class combinations
 *    - Button patterns (btnPrimary, btnSecondary, etc.)
 *    - Card patterns (cardBase, cardHover, etc.)
 *    - Form patterns (inputBase, selectBase, labelBase)
 *    - Table patterns
 *    - Modal patterns
 *    - And more...
 * 
 * 3. /context/ToastContext.tsx
 *    - ToastProvider component
 *    - useToast hook
 *    - useToastHelper hook
 *    - Toast types and interfaces
 * 
 * 4. /constants/designGuide.ts (THIS FILE)
 *    - Complete implementation guide
 *    - Examples and patterns
 *    - Best practices
 *    - Migration steps
 */

// ============================================================================
// QUICK REFERENCE
// ============================================================================

/**
 * Common Tasks:
 * 
 * Show success message:
 *   toast.success('Done!');
 * 
 * Create primary button:
 *   <button className={BUTTON_STYLES.primary}>Click me</button>
 * 
 * Create card:
 *   <div className={getCardClass('hover')}>Content</div>
 * 
 * Add form input:
 *   <input className={inputBase} type="text" />
 * 
 * Create table:
 *   <table className={tableBase}>
 *     <thead className={thBase}>
 *       <tr>
 *         <th className={thBase}>Header</th>
 *       </tr>
 *     </thead>
 *   </table>
 * 
 * Show error:
 *   toast.error('Something went wrong');
 * 
 * Disable button:
 *   <button disabled className={BUTTON_STYLES.primary}>...</button>
 * 
 * Show loading spinner:
 *   <div className={spinner}></div>
 */
