const express = require('express');
const cors = require('cors');
const fileUpload = require('express-fileupload')

const { connectionDB } = require('../database/configDB');
const auth = require('../routes/user-auth');
const router = require('../routes/user-routes');
const categories = require('../routes/categories-routes');
const products = require('../routes/products-routes');
const search  = require('../routes/search-routes');
const uploads = require('../routes/uploads-routes');

class Server { 

  constructor() { 
    this.app = express();
    this.port = process.env.PORT || 8080;

    // Connection with DB
    this.conectDB();
    // Middleware
    this.middleware();
    // Routes
    this.routes();
  }

  async conectDB() {
    await connectionDB();
  }
  middleware() {
    // cors
    this.app.use(cors());

    // Body parse
    this.app.use(express.json());
    
    //Static files
    this.app.use(express.static('public'));

    // Upload files
    this.app.use(fileUpload({
      useTempFiles : true,
      tempFileDir : '/tmp/',
      createParentPath: true
    })); 
  }
  routes() {
    this.app.use('/api/auth', auth);
    this.app.use('/api/categories', categories);
    this.app.use('/api/users', router);
    this.app.use('/api/products', products);
    this.app.use('/api/search', search);
    this.app.use('/api/uploads', uploads);
  };

  listen() {
    this.app.listen(this.port, () => {
      (this.port)
        ? console.log(`Listening port in http://localhost:${this.port}/api/users`)
        : console.log(`Failed connection to http://localhost:${this.port}/api/users `);
    })
  }
};


module.exports = Server;