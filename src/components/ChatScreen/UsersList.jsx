import React from "react";
import { Avatar, Badge, Button, Card, Flex } from "antd";
import { collection, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { LogoutOutlined } from "@ant-design/icons";
import { signOut } from "firebase/auth";
import { auth, db } from "../../utils/firebase.util";
import { useNavigate } from "react-router-dom";

const UsersList = ({ users, recipient, setRecipient }) => {

  const navigate = useNavigate();
  const addUserToChats = async (user) => {
    const chatsRef = collection(db, "chats");
    const storedDocRef = doc(
      chatsRef,
      auth.currentUser.uid,
      "stored",
      user.user_id
    );

    const snap = await getDoc(storedDocRef);
    if (!snap.exists()) {
      await setDoc(storedDocRef, {
        messages: [],
      });
      await setDoc(doc(chatsRef, auth.currentUser.uid, "new", user.user_id), {
        messages: [],
      });

      await setDoc(
        doc(chatsRef, user.user_id, "stored", auth.currentUser.uid),
        {
          messages: [],
        }
      );
      await setDoc(doc(chatsRef, user.user_id, "new", auth.currentUser.uid), {
        messages: [],
      });
    }
  };

  const handleLogout = async () => {
    const currentUserId = auth.currentUser.uid;
    await signOut(auth);
    await updateDoc(doc(db, "users", currentUserId), {
      online: false,
    });
    navigate("/signin");
  };

  return (
    <Flex vertical style={{ padding: "8px 0" }}>
      <Flex align="center" justify="center" style={{ padding: "8px 0" }}>
        <Button icon={<LogoutOutlined />} onClick={handleLogout}>
          Logut
        </Button>
      </Flex>
      {users.map((user) => (
        <Card
          size="small"
          key={user.user_id}
          style={{
            borderRadius: 0,
            borderLeft: 0,
            borderRight: 0,
            marginBottom: -1,
            background:
              recipient && recipient.user_id === user.user_id
                ? "rgb(245, 245, 245)"
                : "#fff",
          }}
          onClick={() => {
            addUserToChats(user).then(() => {
              setRecipient(user);
            });
          }}
        >
          <Card.Meta
            avatar={
              <Avatar src="https://api.dicebear.com/7.x/miniavs/svg?seed=2" />
            }
            title={user.email || "User"}
            description="This is the description"
          />
          {user.online && (
            <Badge
              status="processing"
              color="green"
              style={{ position: "absolute", top: 10, right: 10 }}
            />
          )}
        </Card>
      ))}
    </Flex>
  );
};

export default UsersList;
