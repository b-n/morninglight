'use strict';
const createSchedule = require('./controllers/create-schedule.js');

module.exports.create = (event, context, callback) => {

  createSchedule(event, (error, result) => {
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