import React, { useContext } from "react";
import {
  BoldLink,
  BoxContainer,
  FormContainer,
  Input,
  MutedLink,
  SubmitButton,
} from "./common";
import { Marginer } from "../marginer";
import { AccountContext } from "./accountContext";
import { useHistory } from "react-router-dom";

export function LoginForm() {
  const { switchToSignup, switchToForgotPassword } = useContext(AccountContext);
  const history = useHistory();

  const loginHandle = (e) => {
    e.preventDefault();

    var authInfo = {
      username: document.getElementById("email").value,
      password: document.getElementById("password").value,
    };

    var formBody = [];
    for (let info in authInfo) {
      var encodedKey = encodeURIComponent(info);
      var encodedValue = encodeURIComponent(authInfo[info]);
      formBody.push(encodedKey + "=" + encodedValue);
    }
    formBody = formBody.join("&");

    async function fetchData() {
      const response = await fetch("http://localhost:8080/api/v1/login", {
        headers: {
          Accept: "application/x-www-form-urlencoded;charset=UTF-8",
          "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
        },
        method: "POST",
        body: formBody,
      });
      if (response.status == 200) {
        //const data = await response.json();
        //console.log(response);
        history.push("/admin"); //doing redirect here.
      } else {
        const data = await response.json();
        console.log(data);
        window.alert(JSON.stringify(data));
      }
    }
    fetchData();
  };

  return (
    <BoxContainer>
      <FormContainer id="loginForm" onSubmit={loginHandle}>
        <Input id="email" type="email" placeholder="Email" />
        <Input id="password" type="password" placeholder="Password" />
      </FormContainer>
      <Marginer direction="vertical" margin={10} />
      <MutedLink href="#" onClick={switchToForgotPassword}>
        Forget your password?
      </MutedLink>
      <Marginer direction="vertical" margin="1.6em" />
      <SubmitButton type="submit" form="loginForm">
        Signin
      </SubmitButton>
      <Marginer direction="vertical" margin="1em" />
      <MutedLink>
        Do not have an accoun?
        <BoldLink href="#" onClick={switchToSignup}>
          Signup
        </BoldLink>
      </MutedLink>
    </BoxContainer>
  );
}
