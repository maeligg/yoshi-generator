require('dotenv').config();
const fs = require('fs'),
    mergeImages = require('merge-images'),
    { Canvas, Image } = require('canvas'),
    PNG = require('pngjs').PNG,
    hexRgb = require('hex-rgb'),
    Jimp = require('jimp')
    Twit = require('twit'),
    config = {
        twitter: {
            consumer_key: process.env.CONSUMER_KEY,
            consumer_secret: process.env.CONSUMER_SECRET,
            access_token: process.env.ACCESS_TOKEN,
            access_token_secret: process.env.ACCESS_TOKEN_SECRET
        }
    },
    T = new Twit(config.twitter);

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

const imageParts = [`./img/head/head${Math.floor(Math.random() * 15) + 1}.png`, `./img/body/body${Math.floor(Math.random() * 7) + 1}.png`, `./img/feet/feet${Math.floor(Math.random() * 3) + 1}.png`, `./img/tail/tail${Math.floor(Math.random() * 5) + 1}.png`];

const jimps = imageParts.map(imagePart => Jimp.read(imagePart));

Promise.all(jimps).then(function(data) {
  return Promise.all(jimps);
}).then(function(data) {
    new Jimp(140, 80, `hsla(${Math.floor(Math.random() * 360)}, 85%, 95%, 1)`, (err, image) => {
        if (err) { console.log(err) }
        return image
            .composite(data[0],30,0)
            .composite(data[1],62,48)
            .composite(data[2],62,72)
            .composite(data[3],90,0)
            .write(`${__dirname}/dist/out-temp.png`);
    });
});

// Now let's paint our boy
const randomPaletteRGB = Object.values(yoshiPalette)[Math.floor(Math.random() * Object.keys(yoshiPalette).length)].map(color => hexRgb(color));
fs.createReadStream('./dist/out-temp.png')
    .pipe(
        new PNG({
        filterType: 4,
        })
    )
    .on('parsed', function () {
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
    
        const dist = this.pack().pipe(fs.createWriteStream('./dist/out-final.png'));

        dist.addListener('finish', () => {
            fs.readFile('./dist/out-final.png', { encoding: 'base64' }, (err, b64) => {
                if (err) throw err;

                // And finally we post the image to Twitter
                T.post('media/upload', { media_data: b64 }, function(err, data) {
                    if (err) {
                        console.log('error!', err);
                    } else {
                        console.log('tweeting the image...');
                        
                        T.post(
                            'statuses/update',
                            {
                                media_ids: new Array(data.media_id_string)
                            },
                            function(err) {
                                if (err){
                                console.log('ERROR:\n', err);
                                }
                            }
                        );
                    }
                });
            });
        });
    });
