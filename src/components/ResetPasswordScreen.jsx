import React, { useState } from "react";
import { Button, Card, Flex, Input, Result, Space, Typography } from "antd";
import { Link, useSearchParams } from "react-router-dom";
import { confirmPasswordReset } from "firebase/auth";

import { auth } from "../utils/firebase.util";

const { Title, Text } = Typography;

const ResetPasswordScreen = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setLoading] = useState(false);
  const [passwordReset, setPasswordReset] = useState(false);
  const [searchParams] = useSearchParams();
  const oobCode = searchParams.get("oobCode");

  const handlePasswordReset = async () => {
    setLoading(true);
    try {
      if (password && password.trim() !== "") {
        if (password === confirmPassword) {
          await confirmPasswordReset(auth, oobCode, password);
          setPasswordReset(true);
        } else {
          alert("Password does not match confirm password");
        }
      } else {
        alert("Please enter a valid password");
      }
    } catch (error) {
      console.log(error, error.code);
    }
    setLoading(false);
  };

  if(!oobCode) {
    alert("invalid params");
  }

  return (
    <Flex align="center" vertical justify="center" style={{ height: "100%" }}>
      <Card
        title={
          <Title level={3} style={{ textAlign: "center" }}>
            Reset Password
          </Title>
        }
        style={{ minWidth: 300 }}
      >
        {passwordReset ? (
          <Result
            status="success"
            title="Success!"
            subTitle={
              <Text style={{ display: "inline-block", width: 300 }}>
                Password Reset Successfully!
                <br />
                <Link to="/signin">Signin</Link>
              </Text>
            }
          />
        ) : (
          <Flex vertical align="center" gap={16}>
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
            <Space direction="vertical" style={{ width: "100%" }}>
              <Text>Confirm password</Text>
              <Input.Password
                placeholder="confirm password"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value || "");
                }}
              />
            </Space>

            <Button
              type="primary"
              block
              onClick={handlePasswordReset}
              loading={isLoading}
            >
              Confirm
            </Button>
          </Flex>
        )}
      </Card>
    </Flex>
  );
};

export default ResetPasswordScreen;
