#!/usr/bin/env node

const {execSync} = require('child_process');
const path = require('path');
const fs = require('fs-extra');
const Handlebars = require('handlebars');

function createEnvLocalFile(projectPath, fileName, envContent) {
  const envFilePath = path.join(projectPath, fileName);

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

function initializeGitRepository(projectPath) {
  try {
    // Initialize a new Git repository
    execSync('git init', {cwd: projectPath});
    console.log('Initialized a new Git repository.');

    // Stage all files in the repository
    execSync('git add .', {cwd: projectPath});
    console.log('Staged all files.');

    // Commit the staged files with an initial commit message
    execSync('git commit -m "Initial commit"', {cwd: projectPath});
    console.log('Created initial commit.');
  } catch (error) {
    console.error('Failed to initialize Git repository or commit files:', error);
  }
}

function applyTemplate(filePath, data) {
  const template = fs.readFileSync(filePath, 'utf8');
  const compileTemplate = Handlebars.compile(template);
  const content = compileTemplate(data);
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Template applied to ${filePath}`);
}

function replaceProjectName(projectPath, projectName, filesToReplace) {
  const data = {'project_name': projectName};

  console.log(`Applying template to replace project name in file...`);
  filesToReplace.forEach(file => {
    applyTemplate(file, data);
  });
  console.log(`Template applied for all instances of project name -- ${projectName}`);
}

const createExpoProject = (projectName) => {
  const templatePath = path.join(__dirname, 'expo-template');
  const projectPath = path.join(process.cwd(), 'expo-' + projectName);

  // Copying the expo-template excluding node_modules
  fs.copySync(templatePath, projectPath);
  console.log(`Copied template from ${templatePath} to ${projectPath}`);

  // Updating files to use user's project name input
  replaceProjectName(projectPath, projectName, [
    path.join(projectPath, 'package.json'),
    path.join(projectPath, 'app.json'),
    // Add other file paths that needs 'project_name' updated
  ]);

  // Create the .env.local template file
  createEnvLocalFile(projectPath, '.env.file', [
    'EXPO_PUBLIC_SERVER_BASE_URL=',
    'EXPO_PUBLIC_SUPABASE_URL=',
    'EXPO_PUBLIC_SUPABASE_KEY=',
  ].join('\n'));

  // Rename .npmignore to .gitignore
  renameNpmignoreToGitignore(projectPath);

  // Initialize a new git repo
  initializeGitRepository(projectPath);
};

const createExpressProject = (projectName) => {
  const templatePath = path.join(__dirname, 'express-template');
  const projectPath = path.join(process.cwd(), 'express-' + projectName);

  // Copying the express-template excluding node_modules
  fs.copySync(templatePath, projectPath);
  console.log(`Copied template from ${templatePath} to ${projectPath}`);

  // Updating files to use user's project name input
  replaceProjectName(projectPath, projectName, [
    path.join(projectPath, 'package.json'),
    path.join(projectPath, 'docker-compose-dev.yml'),
    // Add other file paths that needs 'project_name' updated
  ]);

  // Create the .env.local template file
  createEnvLocalFile(projectPath, '.env', [
    'SUPABASE_URL=',
    'SUPABASE_KEY=',
    'SUPABASE_JWT_SECRET=',
  ].join('\n'));

  // Rename .npmignore to .gitignore
  renameNpmignoreToGitignore(projectPath);

  // Initialize a new git repo
  initializeGitRepository(projectPath);
};

const projectName = process.argv[2];
if (!projectName) {
  console.error(`Please specify the project name: create-expo-express-app project-name`);
  process.exit(1);
}

createExpoProject(projectName);
createExpressProject(projectName);