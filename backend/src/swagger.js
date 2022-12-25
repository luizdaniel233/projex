require('dotenv').config()
const path = require('node:path');
const options = {
    language: 'pt-BR',
    openapi: '3.0.0'
}
const swaggerAutogen = require('swagger-autogen')(options);

const doc = {
    info: {
      version: '1.0.0',
      title: 'API PROJEX',
      description: 'Essa API tem como objetivo a demonstração do correto funcionamento das rotas, bem como ser um norteado para as equipes de Frontend e Testers.',
    },
    host: "http://localhost:3001",
    
    basePath: process.env.SWAGGER_API_PATH,
    schemes: [process.env.SWAGGER_SCHEME],
    consumes: ['application/json'],
    produces: ['application/json'],

    securityDefinitions: {
      bearerAuth : {
        type : 'http' ,
        scheme : 'bearer' ,
        bearerFormat : 'JWT'
    }
   
  },
    definitions: {},        
    components: {}          
  };
const outputFile = path.join('./src','swagger','swagger_out.json');

console.log(outputFile)

const endpointsFiles = [path.join('./src','server.js')];

swaggerAutogen(outputFile, endpointsFiles, doc);