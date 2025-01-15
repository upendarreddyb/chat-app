import { React, useState } from "react";
import { Button, FormControl, FormLabel, Input, VStack } from "@chakra-ui/react";
import { useToast } from "@chakra-ui/react";
import { useHistory } from "react-router-dom";

import axios from "axios";

const Login = () => {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const toast = useToast();
  const [isLoading, setloading] = useState(false);

  const history = useHistory();

  const submitHandler = async () => {
    setloading(true);
    if (!email || !password) {
      toast({
        title: "Please fill all the Fields",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    } else {
      try {
        const config = {
          headers: {
            "Content-type": "application/json",
          },
        };
        console.log(email, password);
        const { data } = await axios.post("/api/user/login", { email, password }, config);
        toast({
          title: "Login is Sucessful",
          status: "success",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });

        localStorage.setItem("userInfo", JSON.stringify(data));
        setloading(false);
        history.push("/chats");
        return;
      } catch (error) {
        toast({
          title: "Error Occured!",
          description: error.response.data.message,
          status: "warning",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
        return;
      }
    }
  };

  return (
    <VStack spacing="5" color="black">
      <FormControl>
        <FormLabel>Email</FormLabel>
        <Input
          placeholder="Enter Email"
          onChange={(e) => {
            setEmail(e.target.value);
          }}
        />
        <FormLabel>Password</FormLabel>
        <Input
          placeholder="Enter Password"
          onChange={(e) => {
            setPassword(e.target.value);
          }}
        />
      </FormControl>
      <Button colorScheme="blue" width="100%" onClick={submitHandler} isLoading={isLoading}>
        Login
      </Button>
    </VStack>
  );
};

export default Login;
