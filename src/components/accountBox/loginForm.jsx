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

    async function fetchData() {
      console.log("FETCH LOGIN---NOT IMPLEMENTED YET");
      /* const response = await fetch(`http://localhost:8080/api/v1/user`);
      if (response) {
        const data = await response.json();
        console.log(data);
      } */
      history.push("/admin"); //doing redirect here.
    }
    fetchData();
  };

  return (
    <BoxContainer>
      <FormContainer id="loginForm" onSubmit={loginHandle}>
        <Input type="email" placeholder="Email" />
        <Input type="password" placeholder="Password" />
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
