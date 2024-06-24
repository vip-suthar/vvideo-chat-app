import React, { useState } from "react";
import { Button, Card, Flex, Input, Result, Typography } from "antd";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../utils/firebase.util";

const { Title, Text } = Typography;

const ForgotPasswordScreen = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setLoading] = useState(false);
  const [mailSent, setMailSent] = useState(false);

  const triggerResetEmail = async () => {
    if (email && email.trim() !== "") {
      setLoading(true);
      try {
        await sendPasswordResetEmail(auth, email);
        setMailSent(true);
      } catch (error) {
        alert("some error occured!!");
      }
      setLoading(false);
    } else {
      alert("Please enter email id to continue");
    }
  };

  return (
    <Flex align="center" vertical justify="center" style={{ height: "100%" }}>
      <Card
        title={
          <Title level={3} style={{ textAlign: "center" }}>
            Forgot Password
          </Title>
        }
        style={{ minWidth: 300 }}
      >
        {mailSent ? (
          <Result
            status="success"
            title="Success!"
            subTitle={
              <Text style={{ display: "inline-block", width: 300 }}>
                An email containing password reset instructions is sent
                successfully to <Text strong>{email}</Text>
                <br />
                <Text>
                  Not you?
                  <Button
                    type="link"
                    onClick={() => {
                      setEmail("");
                      setMailSent(false);
                    }}
                    style={{ padding: 0 }}
                  >
                    Change
                  </Button>
                </Text>
              </Text>
            }
            extra={[
              <Text>
                Didn't receive email?
                <Button
                  type="link"
                  onClick={triggerResetEmail}
                  style={{ padding: 0 }}
                >
                  Resend
                </Button>
              </Text>,
            ]}
          />
        ) : (
          <Flex vertical align="center" gap={16}>
            <Text
              style={{
                display: "inline-block",
                width: 300,
                textAlign: "center",
              }}
            >
              No worries! Most of us does. Enter your email and we'll send you
              an email to with password reset link.{" "}
            </Text>
            <Input
              placeholder="Enter email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value || "");
              }}
            />

            <Button
              type="primary"
              block
              loading={isLoading}
              onClick={triggerResetEmail}
            >
              Continue
            </Button>
          </Flex>
        )}
      </Card>
    </Flex>
  );
};

export default ForgotPasswordScreen;
