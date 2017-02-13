'use strict';
const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient();
const moment = require('moment');

module.exports = (event, callback) => {

    const params = {
        TableName: 'schedules'
    };

    return dynamoDb.scan(params, function (error, data) {
        if (error) callback(error);

        const events = data.Items.reduce((eventsArr, item) => {

            if (item.isActive === false) return eventsArr;

            if (!item.daysOfWeek.length) {
                const momentObj = moment(item.timeOfDay, 'HH:mm');
                if (momentObj.isSameOrBefore(moment())) momentObj.add(1, 'day');
                return eventsArr.concat([momentObj]);
            }

            const itemEvents = item.daysOfWeek.map(day => {
                const momentObj = moment(item.timeOfDay, 'HH:mm').day(day);
                if (momentObj.isSameOrBefore(moment())) momentObj.add(7, 'days');
                return momentObj;
            });

            return eventsArr.concat(itemEvents);
        }, []);

        const nextEvent = moment.min(events).format('HH:mm, ddd, DD MMM');

        console.log('Next event', nextEvent);
        callback(null, nextEvent);

    });
    //TODO: switch to promises
    //TODO: handle timezones
    //TODO: if no days, have to set isActive = false after the event has happened
};
