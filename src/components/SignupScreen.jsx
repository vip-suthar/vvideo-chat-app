import React, { useEffect, useState } from "react";
import { Button, Card, Flex, Input, Space, Typography } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";

import { auth } from "../utils/firebase.util";
const { Title, Text } = Typography;

const SignupScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (auth.currentUser) navigate("/");
  }, [auth.currentUser?.uid]);

  const handleSignup = () => {
    setLoading(true);
    if (email && email.trim() !== "" && password && password.trim() !== "") {
      createUserWithEmailAndPassword(auth, email, password)
        .then((_user) => {
          setLoading(false);
          navigate("/");
        })
        .catch((_err) => {
          setLoading(false);
          alert("some error occured!!");
        });
    } else {
      alert("Please fill in all fields");
    }
  };

  return (
    <Flex align="center" justify="center" style={{ height: "100%" }}>
      <Card
        title={
          <Title level={3} style={{ textAlign: "center" }}>
            Sign Up
          </Title>
        }
        style={{ minWidth: 300 }}
      >
        <Flex vertical align="center" gap={16}>
          <Space direction="vertical" style={{ width: "100%" }}>
            <Text>Email</Text>
            <Input
              placeholder="Enter email"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value || "");
              }}
            />
          </Space>
          <Space direction="vertical" style={{ width: "100%" }}>
            <Text>Password</Text>
            <Input.Password
              placeholder="Enter password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value || "");
              }}
            />
          </Space>
          <Button
            type="primary"
            block
            onClick={handleSignup}
            loading={isLoading}
          >
            Sign Up
          </Button>
          <Text>
            Already have an account?<Link to="/signin">Signin</Link>
          </Text>
        </Flex>
      </Card>
    </Flex>
  );
};

export default SignupScreen;
