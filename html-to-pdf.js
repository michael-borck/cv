#!/usr/bin/env node

// Simple HTML to PDF converter using Puppeteer
// Install: npm install puppeteer

const puppeteer = require('puppeteer');
const path = require('path');

(async () => {
  const htmlFile = path.resolve('output/cv-michael-borck.html');
  const pdfFile = path.resolve('output/cv-michael-borck.pdf');
  
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  await page.goto(`file://${htmlFile}`, {
    waitUntil: 'networkidle2'
  });
  
  await page.pdf({
    path: pdfFile,
    format: 'A4',
    printBackground: true,
    margin: {
      top: '15mm',
      right: '15mm',
      bottom: '15mm',
      left: '15mm'
    }
  });
  
  await browser.close();
  
  console.log(`PDF generated: ${pdfFile}`);
})();