import axios from 'axios';
import { useState } from 'react';
import SignIn from './SignIn';
import SignUp from './SignUp';

type UI = 'signIn' | 'signUp';

function App() {
  const [viewNow, setView] = useState<UI>('signIn');

  const onSignIn = (form: { name: string; id: string; password: string; }) => {
    const {name, id, password} = form;
    axios.post("/api/Users", {
      Id: id,
      Name: name,
      Password: password,
    })
    .then(res=>{
      console.log(res.data);
      alert("성공");
    })
    .catch(err=>{
      console.log(err);
      alert(err);
    });
  }

  const onSignUp = (form: { id:string; pwd:string; }) => {
    const {id, pwd} = form;
    axios.post("/api/Users/User", {
      id: id,
      pwd: pwd
    })
    .then(res=>console.log(res))
    .catch(err=>console.log(err));
  }



  switch(viewNow) {
    case 'signIn':
      return (
        <SignIn onSignIn={onSignIn}></SignIn>
      )
    case 'signUp':
      return(
        <SignUp onSignUp={onSignUp}></SignUp>
      );
  }
}

export default App;
