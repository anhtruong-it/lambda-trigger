import React, { useEffect, useState } from "react";
import { Auth } from 'aws-amplify';
import { withAuthenticator } from '@aws-amplify/ui-react';
import './App.css';
import '@aws-amplify/ui-react/styles.css';
import { Storage } from 'aws-amplify';
import { v4 as uuid } from 'uuid';


function App({ signOut }) {

  // authentication part
  const [user, updateUser] = useState(null);
  useEffect(() => {
    Auth.currentAuthenticatedUser()
      .then(user => updateUser(user))
      .catch(err => console.log(err));
  }, []);

  let isAdmin = false;
  if (user) {
    const { signInUserSession: { idToken: { payload } } } = user;
    //console.log('payload:', payload); // Add this line to log the payload object
    if (payload['cognito:groups'] && payload['cognito:groups'].includes('Admin')) {
      isAdmin = true;
    }
   // console.log('isAdmin:', isAdmin); // Add this line to log the value of isAdmin
  }
  // end authentication part

  // Image part
  const [images, setImages] = useState([]);
  useEffect(() => {
    fetchImages()
  }, []);

  // async function onChange(e) {
  //   // whne a file is uploaded, create a unique name and save it using the Storage API
  //   const file = e.target.files[0];
  //   const filetype = file.name.split('.')[file.name.split.length - 1]
  //   await Storage.put(`${uuid()}.${filetype}`, file)
  //   //Once the file is uploaded, fetch the list of images
  //   fetchImages()
  // }
  async function onChange(e) {
    // when a file is uploaded, create a unique name and save it using the Storage API
    const file = e.target.files[0];
    const filetype = file.name.split('.')[file.name.split.length - 1];
    await Storage.put(`${uuid()}.${filetype}`, file);
    setTimeout(() => {
      //Once the file is uploaded, fetch the list of images
      fetchImages();
    }, 1000); // Delay for 1 seconds before fetching images
  }

  async function fetchImages() {
    try {
      const response = await Storage.list('', { pageSize: 1000 });
      //console.log("response:", response.results.map(item => item.key));
      const keys = response.results ? response.results.map(item => item.key) : [];
      console.log("key1:", keys);
      const signedFiles = await Promise.all(keys.map(async key => {
        try {
          const signedFile = await Storage.get(key).then(url => url);
          return signedFile;
        } catch (error) {
          console.log('Error retrieving signed URL:', error);
          return null; // or handle the error as needed
        }
      }));
      console.log('signedFiles:', signedFiles); // Log the signedFiles array
      setImages(signedFiles);
    } catch (error) {
      console.log(`error: ${error}`);
    }
  }



  return (
    <div className="App">
      {<><header>
        <h1>Hello World</h1>
        {isAdmin && <p>Welcome, Admin</p>}
      </header><button onClick={signOut}>Sign out</button></>}

      <header className="App-header">
        <input
          type="file"
          onChange={onChange}
        />
        {
          <h1>sss</h1>}
        {images.map((image, index) => (
          <img
            src={image}
            alt=""
            key={index}
            style={{ width: 500 }}
          />
        ))
        }
      </header>
    </div>
  );
}

export default withAuthenticator(App);
