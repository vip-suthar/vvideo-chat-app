import { SendOutlined } from "@ant-design/icons";
import { Avatar, Badge, Card, Flex, Input, Tag, Typography } from "antd";
import { Button } from "antd";
import {
  arrayRemove,
  arrayUnion,
  collection,
  doc,
  getDoc,
  onSnapshot,
  query,
  updateDoc,
} from "firebase/firestore";
import React, { useEffect, useRef, useState } from "react";
import { auth, db } from "../../utils/firebase.util";
import { nanoid } from "nanoid";
import dayjs from "dayjs";

const { Text } = Typography;

const ChatMessage = ({ currentUser, chat }) => {
  return (
    <div
      style={{
        // display: "block",
        textAlign: chat.sender === currentUser.uid ? "right" : "left",
        boxSizing: "border-box",
      }}
    >
      <Text
        style={{
          display: "inline-flex",
          background:
            chat.sender === currentUser.uid
              ? "rgb(245, 245, 245)"
              : "rgb(255, 255, 255)",
          border:
            chat.sender !== currentUser.uid
              ? "1px solid rgb(245, 245, 245)"
              : false,
          padding: 8,
          borderRadius: 8,
          maxWidth: "60%",
        }}
        //
      >
        <span>{chat.text}</span>
        <Flex align="end">
          {chat.sender === currentUser.uid && (
            <span
              style={{
                display: "inline-block",
                width: 20,
                height: 20,
                fontSize: chat.isSent ? 10 : 16,
                color: chat.isSeen ? "rgb(31, 126, 255)" : "gray",
              }}
            >
              {chat.isSent ? "✓✓" : "✓"}
            </span>
          )}
          <span
            style={{
              display: "inline-block",
              width: 26,
              // height: 20,
              fontSize: 10,
              marginLeft: 4,
            }}
          >
            {dayjs(chat.timestamp).format("HH:mm")}
          </span>
        </Flex>
      </Text>
    </div>
  );
};

const Chat = ({ user }) => {
  const currentUser = auth.currentUser;
  const [msg, setMsg] = useState("");
  const [storedChats, setStoredChats] = useState([]);
  // const [newChats, setNewChats] = useState([]);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, []);

  useEffect(() => {
    const chatsRef = collection(db, "chats");

    const unsubsStored = onSnapshot(
      doc(chatsRef, currentUser.uid, "stored", user.user_id),
      (snap) => {
        if (snap.data()) {
          setStoredChats([...snap.data().messages]);
        }
        scrollToBottom();
      }
    );

    const unsubsNew = onSnapshot(
      doc(chatsRef, currentUser.uid, "new", user.user_id),
      async (snap) => {
        // if (snap.data()) setNewChats(snap.data().messages);
        if (snap.data()) {
          await updateDoc(
            doc(chatsRef, currentUser.uid, "stored", user.user_id),
            {
              messages: arrayUnion(
                ...snap
                  .data()
                  .messages.map((m) => ({ ...m, isSeen: true, isSent: true }))
              ),
            }
          );

          await updateDoc(doc(chatsRef, currentUser.uid, "new", user.user_id), {
            messages: arrayRemove(...snap.data().messages),
          });

          // const updatedChats = [
          //   ...storedChats,
          //   ...snap.data().messages.map((m) => ({ ...m, isSeen: true })),
          // ];

          const q = query(
            doc(chatsRef, user.user_id, "stored", currentUser.uid)
          );
          const docSnap = await getDoc(q);

          if (docSnap.data()) {
            await updateDoc(
              doc(chatsRef, user.user_id, "stored", currentUser.uid),
              {
                messages: docSnap.data().messages.map((item) => ({
                  ...item,
                  isSeen: true,
                  isSent: true,
                })),
              }
            );
          }
          // console.log(updatedChats);
          // setStoredChats((prev) => [
          //   ...prev,
          //   ...snap.data().messages.map((m) => ({ ...m, isSeen: true })),
          // ]);
        }
      }
    );

    return () => {
      unsubsStored();
      unsubsNew();
    };
  }, [user.user_id, currentUser.uid]);

  const sendMessage = async () => {
    if (msg && msg.trim() !== "") {
      const message = {
        id: nanoid(),
        text: msg,
        sender: currentUser.uid,
        receiver: user.user_id,
        isSent: user.online || currentUser.uid === user.user_id ? true : false,
        isSeen: currentUser.uid === user.user_id ? true : false,
        timestamp: Date.now(),
      };

      await updateDoc(
        doc(db, "chats", currentUser.uid, "stored", user.user_id),
        {
          messages: arrayUnion(message),
        }
      );

      setMsg("");
      // setStoredChats((s) => [...s, message]);
      scrollToBottom();

      if (currentUser.uid !== user.user_id) {
        await updateDoc(
          doc(db, "chats", user.user_id, "new", currentUser.uid),
          {
            messages: arrayUnion(message),
          }
        );
      }
    }
  };

  return (
    <Flex vertical justify="space-between" style={{ height: "100%" }}>
      <Card
        size="small"
        style={{
          position: "sticky",
          borderRadius: 0,
          borderLeft: 0,
          borderRight: 0,
        }}
      >
        <Card.Meta
          avatar={
            <Avatar src="https://api.dicebear.com/7.x/miniavs/svg?seed=2" />
          }
          title={user.email || "User"}
          description={false}
        />
        {user.online && (
          <Tag style={{ position: "absolute", top: 10, right: 10 }}>
            <Badge status="processing" color="green" text="online" />
          </Tag>
        )}
      </Card>

      <div
        style={{
          height: "calc(100% - 70px)",
          overflow: "auto",
          scrollbarGutter: "stable",
        }}
      >
        <Flex
          vertical
          justify="end"
          style={{
            padding: "10px 20px",
            background: "#fff",
            minHeight: "100%",
          }}
          gap={8}
        >
          {storedChats.map((chat) => (
            <ChatMessage key={chat.id} currentUser={currentUser} chat={chat} />
          ))}
          <div ref={messagesEndRef} />
        </Flex>
      </div>

      <Flex
        align="center"
        style={{ padding: 8, height: 70, background: "#fff" }}
      >
        <Input
          placeholder="Write something..."
          value={msg}
          onChange={(e) => {
            setMsg(e.target.value);
          }}
          suffix={
            <Button
              shape="round"
              icon={<SendOutlined />}
              onClick={sendMessage}
            />
          }
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              sendMessage();
            }
          }}
        />
      </Flex>
    </Flex>
  );
};

export default Chat;
