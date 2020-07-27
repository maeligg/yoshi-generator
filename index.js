const fs = require('fs'),
mergeImages = require('merge-images'),
{ Canvas, Image } = require('canvas'),
PNG = require("pngjs").PNG,
hexRgb = require('hex-rgb');

const yoshiPalette = {
    green: ['#00f801', '#00b800', '#007800'],
    yellow: ['#f8f800', '#f8c000', '#f87800'],
    // red: [],
    // blue: []
}

mergeImages([
    { src: './img/empty.png' },
    { src: `./img/head/head${Math.floor(Math.random() * 4) + 1}.png`, x: 0, y: 0 },
    { src: `./img/body/body${Math.floor(Math.random() * 4) + 1}.png`, x: 16, y: 24 },
    { src: `./img/feet/feet${Math.floor(Math.random() * 4) + 1}.png`, x: 16, y: 37 },
    { src: `./img/tail/tail${Math.floor(Math.random() * 2) + 1}.png`, x: 30, y: 24 }]
, {
  Canvas: Canvas,
  Image: Image
})
  .then(b64 => fs.writeFile('./dist/out-temp.png', b64.split(';base64,').pop(), 'base64', function(err) {
    if (err) { console.log(err) };
    console.log('Yoshi created');

    // Now let's paint our boy
    fs.createReadStream("./dist/out-temp.png")
        .pipe(
            new PNG({
            filterType: 4,
            })
        )
        .on("parsed", function () {
            for (let y = 0; y < this.height; y++) {
                for (let x = 0; x < this.width; x++) {
                    const idx = (this.width * y + x) << 2;
            
                    // invert color
                    this.data[idx] = 255 - this.data[idx];
                    this.data[idx + 1] = 255 - this.data[idx + 1];
                    this.data[idx + 2] = 255 - this.data[idx + 2];
                }
            }
        
            this.pack().pipe(fs.createWriteStream("./dist/out-final.png"));
            console.log('Yoshi painted');
        });
  })
);
