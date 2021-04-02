import { createServer } from 'http';
import fs from 'fs';
import sharp from 'sharp';
import request from 'request';
import { parse } from 'url';
import { isNumber } from 'util';

createServer(function (req, res) {

    var url_parts = parse(req.url, true);
    var query = url_parts.query;
    // console.log("query: ", query);

    if (req.url == "/favicon.ico") {
        res.writeHead(204);
        res.end();
        return;
    }

    var Resizing = {};
    var quality = 95;
    var Type = 'webp';
    var AllowedType = ['png','jpeg','jpg','webp'];

    if (!query.image) {
        res.writeHead(200, {'content-type': 'text/html'});
        res.write("<h2>Invalid Parameters</h2>");
        res.end();
        return;
    }

    if (query.h) {
        try {
            Resizing.height = Number(query.h);            
        } catch (error) {
            // console.log("Resizing.height = (int)(query.h)", error);            
        }
    }

    if (query.w) {
        try {
            Resizing.width = Number(query.w);            
        } catch (error) {
            // console.log("Resizing.width = (int)(query.w)", error);            
        }
    }

    if (query.q) {
        try {
            quality = Number(query.q);            
        } catch (error) {
            // console.log("quality = (int)(query.q)", error);            
        }
    }

    if (query.t) {
        try {
            query.t = query.t.toLowerCase();
            if (AllowedType.indexOf(query.t) >= 0) {
                Type = query.t;
            }
        } catch (error) {
        }
    }


    var ImageUrl='https://www.dealsmagnet.com/images/15Ptr1iq/2021/March/24/large/storyhome-10-inch-round-shape-wall-clock-with-glas.jpg';
    request({url : query.image, encoding:null}, function(error, response, body) {
        if (error) {
            res.writeHead(200, {'content-type': 'text/html'});
            res.write("<h2>Invalid Image</h2>");
            res.end();
            return;
        }
        else{
            switch (Type) {
                case 'webp':
                    // CreateWebp(Resizing, quality, body);
                    // console.log("Image Webp", Resizing, quality);
                    const WebpImage = sharp(body);
                    WebpImage
                    .metadata()
                    .then(function(metadata) {
                        return WebpImage
                        .resize(Resizing)
                        .webp({quality: quality})
                        .toBuffer();
                    })
                    .then(function(data) {
                        res.writeHead(200, {
                            'Content-Type': 'image/webp',
                            'Content-Length': data.length
                        });
                        res.write(data);
                        res.end();
                        return;
                    })
                    .catch((err)=>{
                        res.writeHead(200, {'content-type': 'text/html'});
                        res.write("<h2>Failed To Create Image</h2>");
                        res.end();
                        return;
                    });
                    break;
            
                case 'jpg':
                case 'jpeg':
                    // CreateWebp(Resizing, quality, body);
                    // console.log("Image JPG", Resizing, quality);
                    const JpgImage = sharp(body);
                    JpgImage
                    .metadata()
                    .then(function(metadata) {
                        return JpgImage
                        .resize(Resizing)
                        .jpeg({quality: quality})
                        .toBuffer();
                    })
                    .then(function(data) {
                        res.writeHead(200, {
                            'Content-Type': 'image/jpg',
                            'Content-Length': data.length
                        });
                        res.write(data);
                        res.end();
                        return;
                    })
                    .catch((err)=>{
                        res.writeHead(200, {'content-type': 'text/html'});
                        res.write("<h2>Failed To Create Image</h2>");
                        res.end();
                        return;
                    });
                    break;

            
                case 'png':
                    // CreateWebp(Resizing, quality, body);
                    // console.log("Image PNG", Resizing, quality);
                    const PngImage = sharp(body);
                    PngImage
                    .metadata()
                    .then(function(metadata) {
                        return PngImage
                        .resize(Resizing)
                        .png({quality: quality})
                        .toBuffer();
                    })
                    .then(function(data) {
                        res.writeHead(200, {
                            'Content-Type': 'image/png',
                            'Content-Length': data.length
                        });
                        res.write(data);
                        res.end();
                        return;
                    })
                    .catch((err)=>{
                        res.writeHead(200, {'content-type': 'text/html'});
                        res.write("<h2>Failed To Create Image</h2>");
                        res.end();
                        return;
                    });
                    break;

                default:
                    break;
            }
        }
    });


    // function CreateWebp(size, quality, body) {
    //     // var size = null;
    //     console.log("Image Webp", size, quality);
    //     const image = sharp(body);
    //         image
    //         .metadata()
    //         .then(function(metadata) {
    //             return image
    //             .resize(size)
    //             .webp({quality: quality})
    //             .toBuffer();
    //         })
    //         .then(function(data) {
    //             res.writeHead(200, {
    //                 'Content-Type': 'image/webp',
    //                 'Content-Length': data.length
    //             });
    //             res.write(data);
    //             res.end();
    //         })
    //         .catch((err)=>{
    //             res.writeHead(200, {'content-type': 'text/html'});
    //             res.write("<h2>Failed To Create Image</h2>");
    //             res.end();
    //         });
    // }
      
}).listen(8080);