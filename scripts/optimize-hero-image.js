const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const inputPath = path.join(__dirname, '../public/hero/heromobil-görsel.png');
const outputPathWebP = path.join(__dirname, '../public/hero/heromobil-görsel.webp');
const outputPathOptimized = path.join(__dirname, '../public/hero/heromobil-görsel-optimized.png');

async function optimizeImage() {
  try {
    console.log('Görsel optimize ediliyor...');
    
    // WebP formatına dönüştür (daha küçük boyut)
    await sharp(inputPath)
      .webp({ quality: 85 })
      .toFile(outputPathWebP);
    
    const webpStats = fs.statSync(outputPathWebP);
    console.log(`WebP görsel oluşturuldu: ${(webpStats.size / 1024 / 1024).toFixed(2)} MB`);
    
    // PNG'yi optimize et (fallback için)
    await sharp(inputPath)
      .png({ quality: 85, compressionLevel: 9 })
      .toFile(outputPathOptimized);
    
    const pngStats = fs.statSync(outputPathOptimized);
    const originalStats = fs.statSync(inputPath);
    
    console.log(`\nOrijinal PNG: ${(originalStats.size / 1024 / 1024).toFixed(2)} MB`);
    console.log(`Optimize PNG: ${(pngStats.size / 1024 / 1024).toFixed(2)} MB`);
    console.log(`WebP: ${(webpStats.size / 1024 / 1024).toFixed(2)} MB`);
    console.log(`\nTasarruf: ${((1 - webpStats.size / originalStats.size) * 100).toFixed(1)}%`);
    
    console.log('\n✅ Optimizasyon tamamlandı!');
    console.log('WebP formatını kullanmak için hero-section.tsx dosyasını güncelleyin.');
  } catch (error) {
    console.error('Hata:', error);
    process.exit(1);
  }
}

optimizeImage();
