/**
 * ============================================================================
 * DESIGN SYSTEM IMPLEMENTATION CHECKLIST
 * ============================================================================
 * 
 * Track the migration of all pages to the new design system.
 * Update status as each page is improved.
 * 
 * Last Updated: April 28, 2026
 */

export interface ImplementationTask {
  page: string;
  file: string;
  status: 'not-started' | 'in-progress' | 'completed';
  tasks: {
    name: string;
    completed: boolean;
  }[];
  notes?: string;
}

export const IMPLEMENTATION_CHECKLIST: ImplementationTask[] = [
  // =========================================================================
  // CORE APPLICATION FILES
  // =========================================================================
  {
    page: 'Main App Entry',
    file: 'src/main.tsx',
    status: 'not-started',
    tasks: [
      {
        name: 'Wrap app with ToastProvider',
        completed: false,
      },
      {
        name: 'Verify Tailwind CSS is configured',
        completed: false,
      },
    ],
    notes: 'Required for toast notifications to work globally',
  },

  {
    page: 'App.tsx',
    file: 'src/App.tsx',
    status: 'not-started',
    tasks: [
      {
        name: 'Update page background colors',
        completed: false,
      },
      {
        name: 'Standardize spacing',
        completed: false,
      },
    ],
    notes: 'Main app wrapper, affects all pages',
  },

  // =========================================================================
  // AUTHENTICATION
  // =========================================================================
  {
    page: 'Login Page',
    file: 'src/pages/Login.tsx',
    status: 'not-started',
    tasks: [
      {
        name: 'Update form styling (inputs, labels)',
        completed: false,
      },
      {
        name: 'Update button styles to primary',
        completed: false,
      },
      {
        name: 'Replace alert() with toast notifications',
        completed: false,
      },
      {
        name: 'Add error message display',
        completed: false,
      },
      {
        name: 'Update card styling',
        completed: false,
      },
    ],
    notes: 'First page users see - important for impression',
  },

  // =========================================================================
  // NAVIGATION & LAYOUT
  // =========================================================================
  {
    page: 'Sidebar Navigation',
    file: 'src/components/shared/Sidebar.tsx',
    status: 'not-started',
    tasks: [
      {
        name: 'Update sidebar background (slate-900)',
        completed: false,
      },
      {
        name: 'Update nav items styling (hover states)',
        completed: false,
      },
      {
        name: 'Update active nav item styling',
        completed: false,
      },
      {
        name: 'Update link colors and transitions',
        completed: false,
      },
    ],
    notes: 'Appears on all pages - consistency critical',
  },

  {
    page: 'Master Layout',
    file: 'src/components/shared/MasterLayout.tsx',
    status: 'not-started',
    tasks: [
      {
        name: 'Standardize padding and margins',
        completed: false,
      },
      {
        name: 'Update background colors',
        completed: false,
      },
    ],
  },

  // =========================================================================
  // DASHBOARDS
  // =========================================================================
  {
    page: 'Super Admin Dashboard',
    file: 'src/pages/superAdmin/SuperAdminDashboard.tsx',
    status: 'not-started',
    tasks: [
      {
        name: 'Update page header styling (h1, subtitle)',
        completed: false,
      },
      {
        name: 'Update card styling (stats cards)',
        completed: false,
      },
      {
        name: 'Update chart colors to match palette',
        completed: false,
      },
      {
        name: 'Replace alert() with toast',
        completed: false,
      },
      {
        name: 'Update button styles',
        completed: false,
      },
    ],
    notes: 'Dashboard - make it visually impressive',
  },

  {
    page: 'Teacher Dashboard',
    file: 'src/pages/teacher/TeacherDashboard.tsx',
    status: 'not-started',
    tasks: [
      {
        name: 'Update page header styling',
        completed: false,
      },
      {
        name: 'Update card styling',
        completed: false,
      },
      {
        name: 'Update chart colors',
        completed: false,
      },
      {
        name: 'Replace alert() with toast',
        completed: false,
      },
    ],
  },

  // =========================================================================
  // MANAGEMENT PAGES - STUDENTS
  // =========================================================================
  {
    page: 'Manage Students',
    file: 'src/pages/superAdmin/ManageStudents.tsx',
    status: 'not-started',
    tasks: [
      {
        name: 'Update page header and subtitle',
        completed: false,
      },
      {
        name: 'Update search input styling',
        completed: false,
      },
      {
        name: 'Update button styles (Create, Edit, Delete)',
        completed: false,
      },
      {
        name: 'Replace alert() with toast',
        completed: false,
      },
      {
        name: 'Update form inputs in modal',
        completed: false,
      },
      {
        name: 'Update modal styling',
        completed: false,
      },
      {
        name: 'Add form validation error display',
        completed: false,
      },
    ],
    notes: 'Complex page with forms - needs careful updates',
  },

  // =========================================================================
  // MANAGEMENT PAGES - TEACHERS
  // =========================================================================
  {
    page: 'Manage Teachers',
    file: 'src/pages/superAdmin/ManageTeachers.tsx',
    status: 'not-started',
    tasks: [
      {
        name: 'Update page header',
        completed: false,
      },
      {
        name: 'Update search input',
        completed: false,
      },
      {
        name: 'Update button styles',
        completed: false,
      },
      {
        name: 'Replace alert() with toast',
        completed: false,
      },
      {
        name: 'Update modal form styling',
        completed: false,
      },
      {
        name: 'Update table styling',
        completed: false,
      },
    ],
  },

  // =========================================================================
  // MANAGEMENT PAGES - CLASSES
  // =========================================================================
  {
    page: 'Manage Classes',
    file: 'src/pages/superAdmin/ManageClasses.tsx',
    status: 'not-started',
    tasks: [
      {
        name: 'Update page header styling',
        completed: false,
      },
      {
        name: 'Update search input styling',
        completed: false,
      },
      {
        name: 'Update button styles (primary, danger, etc.)',
        completed: false,
      },
      {
        name: 'Update card styling (hover effects)',
        completed: false,
      },
      {
        name: 'Update card badge colors',
        completed: false,
      },
      {
        name: 'Update detail view styling',
        completed: false,
      },
      {
        name: 'Update table styling',
        completed: false,
      },
      {
        name: 'Replace all alert() with toast',
        completed: false,
      },
      {
        name: 'Update modal styling and forms',
        completed: false,
      },
      {
        name: 'Update back button and navigation',
        completed: false,
      },
    ],
    notes: 'Large component - phase updates if needed',
  },

  // =========================================================================
  // MANAGEMENT PAGES - SUBJECTS
  // =========================================================================
  {
    page: 'Manage Subjects',
    file: 'src/pages/superAdmin/ManageSubjects.tsx',
    status: 'not-started',
    tasks: [
      {
        name: 'Update page header styling',
        completed: false,
      },
      {
        name: 'Update search input styling',
        completed: false,
      },
      {
        name: 'Update button styles',
        completed: false,
      },
      {
        name: 'Update card styling',
        completed: false,
      },
      {
        name: 'Update card badge colors',
        completed: false,
      },
      {
        name: 'Update detail view styling',
        completed: false,
      },
      {
        name: 'Replace all alert() with toast',
        completed: false,
      },
      {
        name: 'Update modal styling',
        completed: false,
      },
      {
        name: 'Update form styling',
        completed: false,
      },
    ],
    notes: 'Recently restructured - apply design system',
  },

  // =========================================================================
  // FORM COMPONENTS
  // =========================================================================
  {
    page: 'Form Component',
    file: 'src/components/form.tsx',
    status: 'not-started',
    tasks: [
      {
        name: 'Update input styling',
        completed: false,
      },
      {
        name: 'Update label styling',
        completed: false,
      },
      {
        name: 'Update button styling',
        completed: false,
      },
    ],
    notes: 'If reusable form component exists',
  },

  // =========================================================================
  // CONTEXT & HOOKS
  // =========================================================================
  {
    page: 'Toast Context Setup',
    file: 'src/context/ToastContext.tsx',
    status: 'completed',
    tasks: [
      {
        name: 'Toast system created',
        completed: true,
      },
      {
        name: 'useToastHelper hook created',
        completed: true,
      },
    ],
    notes: 'Already implemented',
  },

  {
    page: 'User Context',
    file: 'src/context/userContext.tsx',
    status: 'not-started',
    tasks: [
      {
        name: 'Update styling if context has UI',
        completed: false,
      },
    ],
  },

  // =========================================================================
  // DESIGN SYSTEM FILES
  // =========================================================================
  {
    page: 'Design System Setup',
    file: 'src/constants/designSystem.ts',
    status: 'completed',
    tasks: [
      {
        name: 'Color palette defined',
        completed: true,
      },
      {
        name: 'Typography system defined',
        completed: true,
      },
      {
        name: 'Button styles defined',
        completed: true,
      },
      {
        name: 'Card styles defined',
        completed: true,
      },
      {
        name: 'All helper functions created',
        completed: true,
      },
    ],
    notes: 'Foundation complete',
  },

  {
    page: 'Component Patterns',
    file: 'src/constants/componentPatterns.ts',
    status: 'completed',
    tasks: [
      {
        name: 'All pattern constants exported',
        completed: true,
      },
      {
        name: 'Ready for use across application',
        completed: true,
      },
    ],
    notes: 'Ready to use',
  },

  {
    page: 'Design Guide',
    file: 'src/constants/designGuide.ts',
    status: 'completed',
    tasks: [
      {
        name: 'Complete implementation guide written',
        completed: true,
      },
      {
        name: 'Examples and patterns documented',
        completed: true,
      },
    ],
    notes: 'Reference available',
  },
];

// =========================================================================
// STATISTICS
// =========================================================================

export function getChecklistStats() {
  const total = IMPLEMENTATION_CHECKLIST.length;
  const completed = IMPLEMENTATION_CHECKLIST.filter(
    (item) => item.status === 'completed'
  ).length;
  const inProgress = IMPLEMENTATION_CHECKLIST.filter(
    (item) => item.status === 'in-progress'
  ).length;
  const notStarted = IMPLEMENTATION_CHECKLIST.filter(
    (item) => item.status === 'not-started'
  ).length;

  const totalTasks = IMPLEMENTATION_CHECKLIST.reduce(
    (sum, item) => sum + item.tasks.length,
    0
  );
  const completedTasks = IMPLEMENTATION_CHECKLIST.reduce(
    (sum, item) => sum + item.tasks.filter((t) => t.completed).length,
    0
  );

  return {
    pages: { total, completed, inProgress, notStarted },
    tasks: { total: totalTasks, completed: completedTasks },
    overallProgress: Math.round((completedTasks / totalTasks) * 100),
  };
}

// =========================================================================
// MIGRATION PRIORITY
// =========================================================================

/**
 * RECOMMENDED UPDATE ORDER:
 * 
 * PHASE 1 (Critical - Affects all pages):
 * 1. Setup ToastProvider in main.tsx
 * 2. Update Sidebar navigation
 * 3. Update MasterLayout
 * 4. Update App.tsx styling
 * 
 * PHASE 2 (High visibility):
 * 5. Update Login page
 * 6. Update Dashboards
 * 
 * PHASE 3 (Management pages):
 * 7. Update ManageStudents
 * 8. Update ManageTeachers
 * 9. Update ManageClasses
 * 10. Update ManageSubjects
 * 
 * PHASE 4 (Refinement):
 * 11. Update form components
 * 12. Test all notifications
 * 13. Test responsive design
 * 14. Final polish and consistency checks
 */

// =========================================================================
// COMMON UPDATES NEEDED (By Type)
// =========================================================================

export const COMMON_UPDATES = {
  pageHeader: [
    'Update h1 to text-4xl font-bold text-slate-900',
    'Update subtitle to text-lg text-slate-600',
    'Add proper mb-8 spacing',
  ],
  buttons: [
    'Primary CTA: bg-indigo-600 hover:bg-indigo-700',
    'Create/Add: bg-emerald-600 hover:bg-emerald-700',
    'Delete: bg-rose-500 hover:bg-rose-600',
    'All: Add shadow-sm hover:shadow-md transition-all duration-200',
  ],
  alerts: [
    'Remove all alert() calls',
    'Replace with toast.success/error/warning/info()',
    'Import useToastHelper hook',
  ],
  tables: [
    'Add border-b to rows',
    'Add hover:bg-slate-50 to rows',
    'Update header: bg-slate-50 border-b border-slate-200',
    'Use consistent cell padding: px-6 py-4',
  ],
  modals: [
    'Use fixed positioning with inset-0',
    'Add overlay: bg-slate-900/50',
    'Update box: bg-white rounded-2xl shadow-xl',
    'Make header sticky with border-b',
    'Make footer sticky with border-t',
  ],
  forms: [
    'Update inputs: w-full px-4 py-2.5 border border-slate-300 rounded-lg',
    'Add focus rings: focus:ring-2 focus:ring-indigo-500',
    'Update labels: text-sm font-semibold text-slate-700',
    'Add help text: text-xs text-slate-500 mt-1',
  ],
};

// =========================================================================
// TESTING CHECKLIST
// =========================================================================

export const TESTING_CHECKLIST = [
  '[ ] All buttons have consistent styling',
  '[ ] All modals have proper overlay and animations',
  '[ ] Forms show error messages inline (not via alert)',
  '[ ] Toast notifications appear in bottom-right',
  '[ ] Colors match the palette (indigo, emerald, rose, amber)',
  '[ ] Spacing is consistent (multiples of 4px)',
  '[ ] Hover states work on all interactive elements',
  '[ ] Responsive design works on mobile/tablet/desktop',
  '[ ] Tables have proper borders and hover states',
  '[ ] Cards have shadow effects and transitions',
  '[ ] Close buttons (X) work on all modals',
  '[ ] Search inputs work and are styled consistently',
  '[ ] Disabled button states are visible',
  '[ ] Loading spinners are visible and animated',
  '[ ] No blue 600 buttons (should be indigo or color-specific)',
  '[ ] All alert/confirm dialogs replaced with toasts/modals',
  '[ ] Page titles and subtitles have proper styling',
  '[ ] Form labels have required indicator (*)',
];
