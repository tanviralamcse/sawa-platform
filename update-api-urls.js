#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Files to update and their import additions
const filesToUpdate = [
  'frontend/src/pages/Dashboard.js',
  'frontend/src/pages/OnboardingBuyer.js', 
  'frontend/src/pages/OnboardingProvider.js',
  'frontend/src/pages/Requests.js',
  'frontend/src/pages/Messages.js',
  'frontend/src/pages/Reviews.js',
  'frontend/src/pages/Settings.js',
  'frontend/src/components/ServiceRequestWizard.js',
  'frontend/src/components/NotificationBell.js'
];

// Function to update a file
function updateFile(filePath) {
  const fullPath = path.join(__dirname, filePath);
  
  if (!fs.existsSync(fullPath)) {
    console.log(`File not found: ${filePath}`);
    return;
  }

  let content = fs.readFileSync(fullPath, 'utf8');
  
  // Add import if not already present
  if (!content.includes("from '../config/api'")) {
    // Find the last import statement
    const importRegex = /import.*from.*['"][^'"]*['"];/g;
    const imports = content.match(importRegex);
    
    if (imports && imports.length > 0) {
      const lastImport = imports[imports.length - 1];
      const lastImportIndex = content.indexOf(lastImport) + lastImport.length;
      
      content = content.slice(0, lastImportIndex) + 
                "\nimport { buildApiUrl } from '../config/api';" + 
                content.slice(lastImportIndex);
    }
  }
  
  // Replace all localhost URLs
  content = content.replace(/http:\/\/localhost:8000\/api\//g, "' + buildApiUrl('");
  content = content.replace(/http:\/\/localhost:8000\/api\/([^'"`]+)/g, "buildApiUrl('$1')");
  
  // Fix any double quotes issues
  content = content.replace(/buildApiUrl\('([^']+)'\)/g, "buildApiUrl('$1')");
  
  fs.writeFileSync(fullPath, content, 'utf8');
  console.log(`Updated: ${filePath}`);
}

// Update all files
filesToUpdate.forEach(updateFile);

console.log('All files updated!');
