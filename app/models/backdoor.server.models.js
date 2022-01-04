const db = require('../../config/db'),
      fs = require('fs');


const reset = (done) => {
  let script = fs.readFileSync('./app/scripts/tables.sql', 'utf8');

  db.get_pool().query(script, function (err, rows){
      //console.log(err, rows);
      if (err){
          console.log(err);
          return done(err);
      }else{
          console.log("DB script executed successfully")
          done(false);
      }
  });
}



const resample = (done) => {
  let script = fs.readFileSync('./app/scripts/dummy_data.sql', 'utf8');

  db.get_pool().query(script, function (err, rows){
      //console.log(err, rows);
      if (err){
          console.log(err);
          return done(err);
      }else{
          console.log("DB script executed successfully")
          done(false);
      }
  });
}

module.exports = {
  reset: reset,
  resample: resample
}
