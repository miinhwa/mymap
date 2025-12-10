// Script to generate a list of all images for each place
// Run this with Node.js: node generate-image-list.js
// This will create image-list.json with all image paths

const fs = require('fs');
const path = require('path');

const assetsPath = path.join(__dirname, 'assets images');
const outputFile = path.join(__dirname, 'image-list.json');

const imageExtensions = ['.jpg', '.jpeg', '.png', '.JPG', '.JPEG', '.PNG', '.DNG'];

function getAllImagesInFolder(folderPath) {
  const images = [];
  try {
    const files = fs.readdirSync(folderPath);
    files.forEach(file => {
      const ext = path.extname(file).toLowerCase();
      if (imageExtensions.some(e => e.toLowerCase() === ext)) {
        images.push(file);
      }
    });
  } catch (e) {
    console.warn(`Cannot read folder: ${folderPath}`, e.message);
  }
  return images.sort();
}

function scanYear(year) {
  const yearPath = path.join(assetsPath, String(year));
  const result = {};
  
  try {
    const folders = fs.readdirSync(yearPath);
    folders.forEach(folder => {
      const folderPath = path.join(yearPath, folder);
      const stat = fs.statSync(folderPath);
      if (stat.isDirectory()) {
        const images = getAllImagesInFolder(folderPath);
        if (images.length > 0) {
          result[folder] = images;
        }
      }
    });
  } catch (e) {
    console.warn(`Cannot read year folder: ${yearPath}`, e.message);
  }
  
  return result;
}

const imageList = {
  2022: scanYear(2022),
  2023: scanYear(2023),
  2024: scanYear(2024),
  2025: scanYear(2025)
};

fs.writeFileSync(outputFile, JSON.stringify(imageList, null, 2), 'utf8');
console.log(`✅ Generated image-list.json with ${Object.keys(imageList).reduce((sum, year) => sum + Object.keys(imageList[year]).length, 0)} places`);
console.log(`   Total images: ${Object.values(imageList).reduce((sum, year) => 
  sum + Object.values(year).reduce((s, imgs) => s + imgs.length, 0), 0)}`);

