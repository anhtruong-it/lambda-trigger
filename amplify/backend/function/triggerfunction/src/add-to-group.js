// const aws = require('aws-sdk');
// exports.handler = async (event, context, callback) => {
//     const cognitoProvider = new
//         aws.CognitoIdentityServiceProvider({
//             apiVersion: '2016-04-18'
//         });
//     let isAdmin = false
//     const adminEmails = ['nat002911@gmail.com', 'truongnguyen4042@gmail.com']
//     // If the user is one of the admins, set the isAdmin variable to true
//     if (adminEmails.indexOf(event.request.userAttributes.email) !== -1) {
//         isAdmin = true
//     }
//     const groupParams = {
//         UserPoolId: event.userPoolId,
//     }
//     const userParams = {
//         UserPoolId: event.userPoolId,
//         Username: event.userName,
//     }
//     if (isAdmin) {
//         groupParams.GroupName = 'Admin'
//         userParams.GroupName = 'Admin'
//         // First check to see if the group exists, and if not create the group
//         try {
//             await cognitoProvider.getGroup(groupParams).promise();
//         } catch (e) {
//             await cognitoProvider.createGroup(groupParams).promise();
//         }
//         // If the user is an administrator, place them in the Admin group
//         try {
//             await cognitoProvider.adminAddUserToGroup(userParams).promise();
//             callback(null, event);
//         } catch (e) {
//             callback(e);
//         }
//     } else {
//         // If the user is in neither group, proceed with no action
//         callback(null, event)
//     }
// }
const aws = require('aws-sdk');

exports.handler = async (event) => {
  const cognitoProvider = new aws.CognitoIdentityServiceProvider({ apiVersion: '2016-04-18' });

  const adminEmails = ['nat002911@gmail.com'];
  //const adminEmails = 'nat002911@gmail.com';
  const userEmail = event.request.userAttributes.email;

  if (adminEmails.includes(userEmail)) {
    const groupParams = {
      UserPoolId: event.userPoolId,
      GroupName: ['Admin']
    };

    const userParams = {
      UserPoolId: event.userPoolId,
      Username: event.userName,
      GroupName: ['Admin']
    };

    try {
      await cognitoProvider.adminAddUserToGroup(userParams).promise();
      console.log("email check")
    } catch (error) {
      console.error('Error adding user to Admin group:', error);
      throw error;
    }
  }

  return event;
};
