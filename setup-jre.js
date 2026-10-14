const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const jreDir = path.join(__dirname, 'jre');
const javaBin = path.join(jreDir, 'bin', process.platform === 'win32' ? 'java.exe' : 'java');

if (fs.existsSync(javaBin)) {
  console.log('JRE already present at:', javaBin);
  process.exit(0);
}

console.log('Setting up JRE 17 for Linux on Render...');
try {
  if (process.platform === 'linux') {
    const tarFile = path.join(__dirname, 'jre.tar.gz');
    const url = 'https://api.adoptium.net/v3/binary/latest/17/ga/linux/x64/jre/hotspot/normal/eclipse';
    
    console.log('Downloading OpenJDK 17 JRE from Adoptium...');
    execSync(`curl -L -s "${url}" -o "${tarFile}"`, { stdio: 'inherit' });
    
    console.log('Extracting JRE...');
    fs.mkdirSync(jreDir, { recursive: true });
    execSync(`tar -xzf "${tarFile}" -C "${jreDir}" --strip-components=1`, { stdio: 'inherit' });
    
    if (fs.existsSync(tarFile)) {
      fs.unlinkSync(tarFile);
    }
    
    if (fs.existsSync(javaBin)) {
      execSync(`chmod +x "${javaBin}"`);
      console.log('JRE 17 installed successfully at:', javaBin);
    } else {
      console.error('Java binary not found after extraction at:', javaBin);
    }
  } else {
    console.log('Not on Linux, skipping JRE auto-download.');
  }
} catch (err) {
  console.error('Failed to setup JRE:', err.message);
}
