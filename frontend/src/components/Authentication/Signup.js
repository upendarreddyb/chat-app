import { Button, FormControl, FormLabel, Input, VStack } from "@chakra-ui/react";
import React, { useState } from "react";
import axios from "axios";
import { useToast } from "@chakra-ui/react";
import { useHistory } from "react-router-dom";
const Signup = () => {
  const [name, setName] = useState();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [cpassword, setCpassword] = useState();
  const [pic, stePic] = useState();
  const [isLoading, setloading] = useState(false);
  const history = useHistory();
  const toast = useToast();

  const postDetails = async (pics) => {
    if (pics === undefined) {
      toast({
        title: "Please select the image",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }
    if (pics.type === "image/jpeg" || pics.type === "image/png") {
      setloading(true);
      const formData = new FormData();
      formData.append("image", pics);
      const API_KEY = "c2e9cf5aad15d15b2058124571f1444e"; // Replace with your ImgBB API key
      const imgBBResponse = await axios.post(`https://api.imgbb.com/1/upload?key=${API_KEY}`, formData);
      const displayUrl = imgBBResponse.data.data.display_url;
      stePic(displayUrl);
      setloading(false);
      console.log("Image URL:", displayUrl);
      toast({
        title: "Image uploded sucessfully",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }
    toast();
  };

  const submitHandler = async () => {
    setloading(true);
    if (!name || !email || !password || !cpassword) {
      toast({
        title: "Please fill all the Fields",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }
    if (password !== cpassword) {
      toast({
        title: "Passwords Don Not Match",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };
      console.log(name, email, password, pic);
      const { data } = await axios.post("/api/user", { name, email, password, pic }, config);
      toast({
        title: "Registration is Sucessful",
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
  };

  return (
    <VStack spacing="5" color="black">
      <FormControl>
        <FormLabel>Name</FormLabel>
        <Input
          placeholder="Enter Name"
          onChange={(e) => {
            setName(e.target.value);
          }}
        />
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
        <FormLabel>confirm Password</FormLabel>
        <Input
          placeholder="Enter Confirm Password"
          onChange={(e) => {
            setCpassword(e.target.value);
          }}
        />
        <FormLabel>Profile Pic</FormLabel>
        <Input
          type="file"
          onChange={(e) => {
            postDetails(e.target.files[0]);
          }}
        />
      </FormControl>
      <Button colorScheme="blue" width="100%" onClick={submitHandler} isLoading={isLoading}>
        Sign Up
      </Button>
    </VStack>
  );
};

export default Signup;
