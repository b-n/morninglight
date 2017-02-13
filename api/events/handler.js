'use strict';
const createEvent = require('./controllers/create-event.js');

module.exports.create = (event, context, callback) => {

  createEvent(event, (error, result) => {
    //TODO: pull response templates out
    const response = {
      statusCode: 200,
      body: result
    };

    if (error) {
      response.statusCode = 500;
      response.body = error;
      callback(response);
    }

    callback(null, response);
  });
};