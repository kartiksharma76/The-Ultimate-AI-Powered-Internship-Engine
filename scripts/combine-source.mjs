import fs from 'fs';
import path from 'path';

const rootDir = 'c:/Users/kartik sharma/Downloads/internship-engine-project';
const outputFile = path.join(rootDir, 'PROJECT_COMPLETE_SOURCE.md');

const includeExtensions = ['.ts', '.tsx', '.js', '.cjs', '.sql', '.json', '.env', '.css'];
const excludeDirs = ['node_modules', 'dist', '.git', '.gemini', 'artifacts/mockup-sandbox'];

function getAllFiles(dirPath, arrayOfFiles = []) {
  const files = fs.readdirSync(dirPath);

  files.forEach(function(file) {
    const fullPath = path.join(dirPath, file);
    const relativePath = path.relative(rootDir, fullPath);

    if (fs.statSync(fullPath).isDirectory()) {
      if (!excludeDirs.some(exclude => relativePath.startsWith(exclude) || file === exclude)) {
        getAllFiles(fullPath, arrayOfFiles);
      }
    } else {
      const ext = path.extname(file);
      if (includeExtensions.includes(ext) || file === '.env') {
        arrayOfFiles.push(fullPath);
      }
    }
  });

  return arrayOfFiles;
}

async function generate() {
  console.log("Generating complete project source document...");
  const files = getAllFiles(rootDir);
  let content = "# INTERNSHIP ENGINE PROJECT - COMPLETE SOURCE CODE\n\n";
  content += `Generated on: ${new Date().toLocaleString()}\n\n`;

  for (const file of files) {
    const relPath = path.relative(rootDir, file);
    console.log(`Adding ${relPath}...`);
    const fileContent = fs.readFileSync(file, 'utf8');
    const ext = path.extname(file).slice(1) || 'text';
    
    content += `## File: ${relPath}\n`;
    content += `\`\`\`${ext}\n`;
    content += fileContent;
    content += "\n\`\`\`\n\n---\n\n";
  }

  fs.writeFileSync(outputFile, content);
  console.log(`Done! Created ${outputFile}`);
}

generate();
