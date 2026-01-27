const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

// Determine if we have a zip tool (PowerShell specific for Windows)
const sourceDir = path.join(__dirname, 'extension');
const zipFile = path.join(__dirname, 'gigproof-extension.zip');

console.log('Creating extension ZIP file...');

// PowerShell command to zip the folder
const command = `powershell -Command "Compress-Archive -Path '${sourceDir}\\*' -DestinationPath '${zipFile}' -Force"`;

exec(command, (error, stdout, stderr) => {
    if (error) {
        console.error(`Error creating zip: ${error.message}`);
        return;
    }
    if (stderr) {
        console.error(`stderr: ${stderr}`);
        return;
    }
    console.log(`Successfully created ${zipFile}`);
    console.log('You can now upload this file to the Chrome Web Store.');
});
