import React, { useState, useEffect } from 'react';
import './App.css';
import '@aws-amplify/ui-react/styles.css';
import { Authenticator } from '@aws-amplify/ui-react';
import { getCurrentUser, signOut, fetchAuthSession } from 'aws-amplify/auth';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { client } from './utils/client';
import { getUser } from './graphql/queries';
import NavBar from './components/NavBar/NavBar';
import Feed from './components/Feed/Feed';
import CreatePost from './components/CreatePost/CreatePost';
import Profile from './components/Profile/Profile';

function App() {
  const [authUser, setAuthUser] = useState(null);
  const [dbUser, setDbUser] = useState(null);
  const [refreshFeedKey, setRefreshFeedKey] = useState(0);

  useEffect(() => {
    const checkCurrentUser = async () => {
      try {
        const user = await getCurrentUser();
        setAuthUser(user);
      } catch (error) {
        setAuthUser(null);
      }
    };
    checkCurrentUser();
  }, []);

  useEffect(() => {
    if (!authUser) return;

        const fetchDbUser = async () => {
          try {
            await fetchAuthSession(); // Force session refresh
            const userData = await client.graphql({ 
              query: getUser, 
              variables: { id: authUser.userId } 
            });        setDbUser(userData.data.getUser);
      } catch (error) {
        console.error("Error fetching user from DB:", error);
      }
    };
    fetchDbUser();
  }, [authUser]);

  const handlePostCreated = () => {
    setRefreshFeedKey(prevKey => prevKey + 1);
  };

  const handleSignOut = async () => {
    await signOut();
    setAuthUser(null);
    setDbUser(null);
  }

  if (!authUser || !dbUser) {
    return (
      <Authenticator
        formFields={{
          signUp: {
            preferred_username: { order: 1, placeholder: 'Enter your username', isRequired: true, label: 'Username' },
            name: { order: 2, placeholder: 'Enter your full name', isRequired: true, label: 'Name' },
            email: { order: 3, placeholder: 'Enter your email', isRequired: true, label: 'Email' },
            password: { order: 4, placeholder: 'Enter your password', isRequired: true, label: 'Password' },
            phone_number: { order: 5, placeholder: 'Enter your phone number', isRequired: true, label: 'Phone Number' },
            birthdate: { order: 6, placeholder: 'YYYY-MM-DD', isRequired: true, label: 'Birthdate' },
            gender: { order: 7, placeholder: 'Enter your gender', isRequired: true, label: 'Gender' },
          },
        }}
      />
    );
  }

  return (
    <BrowserRouter>
      <div className="App">
        <NavBar signOut={handleSignOut} user={dbUser} />
        <main className="App-content">
          <Routes>
            <Route
              path="/"
              element={
                <>
                  <CreatePost user={dbUser} onPostCreated={handlePostCreated} />
                  <Feed key={refreshFeedKey} />
                </>
              }
            />
            <Route path="/profile/:userId" element={<Profile loggedInUser={dbUser} />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;

