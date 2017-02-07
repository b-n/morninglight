'use strict';
const createSchedule = require('./controllers/create-schedule.js');
const snsPublish = require('aws-sns-publish');

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

    snsPublish('New schedule', {arn: 'arn:aws:sns:eu-central-1:227235672402:morninglightTopic'})
    .catch(err => {
      response.statusCode = 500;
      response.body = error;
      callback(response);
    });

    callback(null, response);
  });
};