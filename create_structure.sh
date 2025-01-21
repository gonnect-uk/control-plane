#!/bin/bash

# Create src and subdirectories
mkdir -p src/{app,components/{ui,layout,dashboard,forms},lib}

# Create public directory
mkdir -p public

# Create files inside app
touch src/app/{layout.tsx,page.tsx}

# Create files inside components/ui
touch src/components/ui/{icons.tsx,metrics-card.tsx}

# Create files inside components/layout
touch src/components/layout/{Layout.tsx,SidebarNav.tsx}

# Create files inside components/dashboard
touch src/components/dashboard/{GCPDashboard.tsx,ProjectCard.tsx,ProjectMetrics.tsx}

# Create files inside components/forms
touch src/components/forms/RegistrationForm.tsx

# Create files inside lib
touch src/lib/types.ts

# Confirmation message
echo "Directories and files created successfully."
