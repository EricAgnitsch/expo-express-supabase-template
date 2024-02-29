#!/usr/bin/env node

const path = require('path');
const fs = require('fs-extra');
const Handlebars = require('handlebars');

function createEnvLocalFile(projectPath) {
  const envFilePath = path.join(projectPath, '.env.local');
  const envContent = `
  EXPO_PUBLIC_SUPABASE_URL=
  EXPO_PUBLIC_SUPABASE_KEY=
  `;

  fs.writeFileSync(envFilePath, envContent, 'utf8');
  console.log('.env.local file created with preset values');
}

function renameNpmignoreToGitignore(projectPath) {
  const npmignorePath = path.join(projectPath, '.npmignore');
  const gitignorePath = path.join(projectPath, '.gitignore');

  if (fs.existsSync(npmignorePath)) {
    fs.renameSync(npmignorePath, gitignorePath);
    console.log('.npmignore has been renamed to .gitignore');
  } else {
    console.log('.npmignore not found, skipping rename.');
  }
}

function applyTemplate(filePath, data) {
  const template = fs.readFileSync(filePath, 'utf8');
  const compileTemplate = Handlebars.compile(template);
  const content = compileTemplate(data);
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Template applied to ${filePath}`);
}

function replaceProjectName(projectPath, projectName) {
  const filesToReplace = [
    path.join(projectPath, 'package.json'),
    path.join(projectPath, 'app.json'),
    // Add other file paths that needs 'project_name' updated
  ];

  const data = {'project_name': projectName};

  console.log(`Applying template to replace project name in file...`);
  filesToReplace.forEach(file => {
    applyTemplate(file, data);
  });
  console.log(`Template applied for all instances of project name -- ${projectName}`);
}

const createProject = (projectName) => {
  const templatePath = path.join(__dirname, 'expo-template');
  const projectPath = path.join(process.cwd(), projectName);

  // Copying the vite-template excluding node_modules
  fs.copySync(templatePath, projectPath);
  console.log(`Copied template from ${templatePath} to ${projectPath}`);

  // Updating files to use user's project name input
  replaceProjectName(projectPath, projectName);

  // Create the .env.local template file
  createEnvLocalFile(projectPath);

  // Rename .npmignore to .gitignore
  renameNpmignoreToGitignore(projectPath);
};

const projectName = process.argv[2];
if (!projectName) {
  console.error(`Please specify the project name: create-expo-express-app project-name`);
  process.exit(1);
}

createProject(projectName);