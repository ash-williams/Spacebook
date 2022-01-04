const backdoor = require('../models/backdoor.server.models'),
      fs       = require('fs');

const photosDirectory = './storage/photos/';


const reset = (req, res) => {
  backdoor.reset((err) => {
    if(err){
      return res.sendStatus(500);
    }else{
      console.log("Now delete the photos...");
      return res.sendStatus(200);
      // fs.readdir(photosDirectory, function(err, files){
      //     console.log("FILES", files);
      //     if(err){
      //       return res.sendStatus(500);
      //     }else if(files.length == 0){
      //       return res.sendStatus(200);
      //     }else{
      //       let i = 0;
      //       let flag = false;

      //       files.forEach(function(file, index){
      //         file_path = photosDirectory + file;

      //         console.log(file_path);
      //         fs.unlink(file_path, function(err){
      //             if(err){
      //                 flag = true;
      //             }
      //         });

      //         i++;
      //         if(i == files.length){
      //             if(flag){
      //                 return res.sendStatus(500);
      //             }else{
      //                 return res.sendStatus(200);
      //             }
      //         }
      //       });
      //     }
      // });
    }
  });
};



const resample = (req, res) => {
  backdoor.resample((err) => {
    if(err){
      return res.sendStatus(500);
    }else{
      return res.sendStatus(201);
    }
  });
}


module.exports = {
  reset: reset,
  resample: resample
}
