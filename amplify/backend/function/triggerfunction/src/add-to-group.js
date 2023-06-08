const { wait } = require('@testing-library/user-event/dist/utils');
const aws = require('aws-sdk');

exports.handler = async (event, context, callback) => {
    const cognitoProvider = new
        aws.CognitoIdentityServiceProvider({
            apiVersion: '2016-04-18'
    });

    let isAdmin = false
    const adminEmails = ['nat002911@gmail.com']

    // if ther user is one of the admins, set the is Admin variable to true
    if (adminEmails.indexOf(event.request.userAttributes.email) !== -1) {
        isAdmin = true
    }

    const groupParams = {
        UserPoolId: event.userPoolId,
    }

    const userParams = {
        UserPoolId: event.userPoolId,
        Username: event.userName,
    }

    if (isAdmin) {
        groupParams.GroupName = 'Admin';
        userParams.GroupName = 'Admin';


        // first check to see if the group exists, and if not create the group
        try {
            await cognitoProvider.getGroup(groupParams).promise();
        } catch (e) {
            await cognitoProvider.createGroup(groupParams).promise();
        }

        // If the user is an administrater, place them in the admin group
        try {
            await cognitoProvider.adminAddUserToGroup(userParams).promise();
            callback(null, event);
        } catch (e) {
            callback(e);
        }
    } else {
        // If ther user is in neither group, proceed with no action
        callback(null, event)
    }
}
