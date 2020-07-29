const fs = require('fs'),
mergeImages = require('merge-images'),
{ Canvas, Image } = require('canvas'),
PNG = require("pngjs").PNG,
hexRgb = require('hex-rgb');

const yoshiPalette = {
    green: ['#00f801', '#00b800', '#007800'],
    yellow: ['#f8f800', '#f8c000', '#f87800'],
    red: ['#f80000', '#b80000', '#880000'],
    blue: ['#8888f8', '#6868d8', '#4040d8'],
    pink: ['#f296d8', '#d962b7', '#9e4785'],
    purple: ['#bc77eb', '#8849b3', '#65258f'],
    brown: ['#f2aE27', '#bf8a1f', '#9c7019']
};
const greenPaletteRGB = yoshiPalette.green.map(color => hexRgb(color));

mergeImages([
    { src: './img/empty.png' },
    { src: `./img/head/head${Math.floor(Math.random() * 15) + 1}.png`, x: 0, y: 0 },
    { src: `./img/body/body${Math.floor(Math.random() * 7) + 1}.png`, x: 16, y: 24 },
    { src: `./img/feet/feet${Math.floor(Math.random() * 3) + 1}.png`, x: 16, y: 36 },
    { src: `./img/tail/tail${Math.floor(Math.random() * 5) + 1}.png`, x: 30, y: 0 }]
, {
  Canvas: Canvas,
  Image: Image
})
  .then(b64 => fs.writeFile('./dist/out-temp.png', b64.split(';base64,').pop(), 'base64', function(err) {
    if (err) { console.log(err) };
    console.log('Yoshi created');

    // Now let's paint our boy
    const randomPaletteRGB = Object.values(yoshiPalette)[Math.floor(Math.random() * Object.keys(yoshiPalette).length)].map(color => hexRgb(color));
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

                    if(
                        this.data[idx] === greenPaletteRGB[0].red
                        && this.data[idx + 1] === greenPaletteRGB[0].green
                        && this.data[idx + 2] === greenPaletteRGB[0].blue
                    ) {
                        this.data[idx] = randomPaletteRGB[0].red;
                        this.data[idx + 1] = randomPaletteRGB[0].green;
                        this.data[idx + 2] = randomPaletteRGB[0].blue;
                    } else if (
                        this.data[idx] === greenPaletteRGB[1].red
                        && this.data[idx + 1] === greenPaletteRGB[1].green
                        && this.data[idx + 2] === greenPaletteRGB[1].blue
                    ) {
                        this.data[idx] = randomPaletteRGB[1].red;
                        this.data[idx + 1] = randomPaletteRGB[1].green;
                        this.data[idx + 2] = randomPaletteRGB[1].blue;
                    } else if (
                        this.data[idx] === greenPaletteRGB[2].red
                        && this.data[idx + 1] === greenPaletteRGB[2].green
                        && this.data[idx + 2] === greenPaletteRGB[2].blue
                    ) {
                        this.data[idx] = randomPaletteRGB[2].red;
                        this.data[idx + 1] = randomPaletteRGB[2].green;
                        this.data[idx + 2] = randomPaletteRGB[2].blue;
                    }
                }
            }
        
            this.pack().pipe(fs.createWriteStream("./dist/out-final.png"));
            console.log('Yoshi painted');
        });
  })
);
