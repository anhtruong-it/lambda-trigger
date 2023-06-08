// import React, { useEffect, useState} from "react";
// import { Auth } from 'aws-amplify';
// import { withAuthenticator } from '@aws-amplify/ui-react';
// import './App.css';
// import '@aws-amplify/ui-react/styles.css';

// function App({ signOut }) {
//   const [user, updateUser] = useState(null);
//   useEffect(() => {
//     Auth.currentAuthenticatedUser()
//     .then(user => updateUser(user))
//     .catch(err => console.log(err));
//   }, [])
//   let isAdmin = false
//   if (user) {
//     const { signInUserSession: { idToken: { payload }} } = user
//     console.log('payload: ', payload);
//     if ( payload['cognito:groups'] && payload['cognito:groups'].includes('Admin')) {
//       isAdmin = true
//     }
//     console.log('admin: ', isAdmin);
//   }

//   return (
//     <div className="App">
//       <header>
//         <h1> Hello World</h1>
//         { isAdmin && <p>Welcome, Admin</p> }
//       </header>
//       <button onClick={signOut}>Sign out</button>
//     </div>
//   )
// }

// export default withAuthenticator(App)

import React, { useEffect, useState } from "react";
import { Auth } from 'aws-amplify';
import { withAuthenticator } from '@aws-amplify/ui-react';
import './App.css';
import '@aws-amplify/ui-react/styles.css';

function App({ signOut }) {
  const [user, updateUser] = useState(null);
  useEffect(() => {
    Auth.currentAuthenticatedUser()
      .then(user => updateUser(user))
      .catch(err => console.log(err));
  }, []);

  let isAdmin = false;
  if (user) {
    const { signInUserSession: { idToken: { payload } } } = user;
    console.log('payload:', payload); // Add this line to log the payload object
    if (payload['cognito:groups'] && payload['cognito:groups'].includes('Admin')) {
      isAdmin = true;
    }
    console.log('isAdmin:', isAdmin); // Add this line to log the value of isAdmin
  }

  return (
    <div className="App">
      <header>
        <h1>Hello World</h1>
        {isAdmin && <p>Welcome, Admin</p>}
      </header>
      <button onClick={signOut}>Sign out</button>
    </div>
  );
}

export default withAuthenticator(App);
