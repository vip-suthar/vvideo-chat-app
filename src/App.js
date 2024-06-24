import React from "react";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";

import SigninScreen from "./components/SigninScreen";
import SignupScreen from "./components/SignupScreen";
import ForgotPasswordScreen from "./components/ForgotPasswordScreen";
import ResetPasswordScreen from "./components/ResetPasswordScreen";
import PrivateRoutes from "./components/PrivateRoutes";
import ChatScreen from "./components/ChatScreen";
import ErrorScreen from "./components/ErrorScreen";

import { auth, db } from "./utils/firebase.util";

import "./App.css";
import { collection, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";

const loaderfn = async () => {
  return await new Promise((res) => {
    onAuthStateChanged(auth, (user) => {
      const usersRef = collection(db, "users");
      if (user) {
        const userDoc = doc(usersRef, user.uid);
        getDoc(userDoc).then((docSnap) => {
          if (docSnap.exists()) {
            updateDoc(userDoc, { online: true });
          } else {
            setDoc(userDoc, {
              user_id: user.uid,
              email: user.email,
              online: true,
            });
          }
        });
      } else {
      }
      res(user);
    });
  });
};

const router = createBrowserRouter([
  {
    path: "/signin",
    element: <SigninScreen />,
  },
  {
    path: "/signup",
    element: <SignupScreen />,
  },
  {
    path: "/forgot-password",
    element: <ForgotPasswordScreen />,
  },
  {
    path: "/reset-password",
    element: <ResetPasswordScreen />,
  },
  {
    element: <PrivateRoutes />,
    loader: loaderfn,
    errorElement: <ErrorScreen />,
    children: [
      {
        path: "/",
        element: <ChatScreen />,
      },
    ],
  },
  {
    path: "*",
    element: <ErrorScreen />,
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
