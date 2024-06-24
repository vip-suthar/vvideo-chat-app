import { Layout } from "antd";
import React, { useState, useEffect } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import UsersList from "./UsersList";
import Chat from "./Chat";
import { auth, db } from "../../utils/firebase.util";
import ChatPlaceholder from "./ChatPlaceholder";

const { Content, Sider } = Layout;

const ChatScreen = () => {
  const [users, setUsers] = useState({});
  const [recipient, setRecipient] = useState(null);

  useEffect(() => {
    const usersRef = collection(db, "users");
    const unsubs = onSnapshot(usersRef, (snap) => {
      const usersData = {};
      snap.docs.forEach((doc) => {
        if (doc.data()) usersData[doc.id] = doc.data();
      });
      console.log(usersData);
      setUsers(usersData);
    });
    return () => {
      unsubs();
    };
  }, []);

  if(!auth.currentUser) return null;

  return (
    <Layout style={{ width: "100%", height: "100%", background: "#fff" }}>
      <Sider
        width="25%"
        style={{
          background: "#fff",
          borderRight: "1px solid rgb(240, 240, 240)",
        }}
      >
        <UsersList
          users={Object.values(users)}
          recipient={recipient}
          setRecipient={setRecipient}
        />
      </Sider>
      <Layout>
        <Content>
          {recipient ? <Chat user={recipient} /> : <ChatPlaceholder />}
        </Content>
      </Layout>
    </Layout>
  );
};

export default ChatScreen;
