const ImageKit = require("imagekit");

const client = new ImageKit({
  privateKey: process.env['IMAGEKIT_PRIVATE_KEY'],
  publicKey: process.env['IMAGEKIT_PUBLIC_KEY'],
  urlEndpoint: process.env['IMAGEKIT_URL_ENDPOINT']
})