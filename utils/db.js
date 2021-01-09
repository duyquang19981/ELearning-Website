const mongoose = require('mongoose');
const dbName = 'finalweb';
const uri = process.env.MONGODB_URL || `mongodb+srv://bintech:1234@dbbintech-zalgy.gcp.mongodb.net/${dbName}`
class Database{
    constructor(){
        
    }

    _connect(){
        mongoose.connect('mongodb://127.0.0.1/my_database', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false, 
            useCreateIndex: true, })
            .then(() => {console.log('connect mongodb successful')})
            .catch((err) => console.log('connect error'));
    }

    _disconnect(db){
        mongoose.disconnect(() => {
            console.log('disconnect')
        })
        
    }
}


module.exports = new Database();