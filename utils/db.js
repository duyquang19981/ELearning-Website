const mongoose = require('mongoose');
const dbName = 'my_database';
const uri = `mongodb+srv://duyquang:1234@cluster0.029na.mongodb.net/${dbName}?retryWrites=true&w=majority`
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