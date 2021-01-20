const mongoose = require('mongoose');
const dbName = 'my_database';
const uri =  process.env.DATABASE_URL || `mongodb+srv://duyquang:1234@cluster0.029na.mongodb.net/${dbName}?ssl=true` 
//const uri = "mongodb://127.0.0.1/my_database"
class Database{

    constructor(){
    }
    
    _connect(){
        mongoose.connect(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false, 
            useCreateIndex: true, })
            .then(() => {
                console.log('connect mongodb successful');
            })
            .catch((err) =>{ console.log('connect error'); console.log('err :>> ', err);});
    }

    _disconnect(db){
        mongoose.disconnect(() => {
            console.log('disconnect')
        })
        
    }
}


module.exports = new Database();