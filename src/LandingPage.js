import * as React from "react";
import { PrimaryButton } from '@fluentui/react/lib/Button';
import {getAuth, getRedirectResult, GoogleAuthProvider, signInWithRedirect} from "firebase/auth";
import App from './App';
import image2 from "./Resources/MacLogo.png";
import { Stack } from '@fluentui/react';

const auth = getAuth()
const provider = new GoogleAuthProvider();
// const db = getFirestore(app);

const signIn = () =>
{
    signInWithRedirect(auth, provider)
}

class landingPage extends React.Component
{

    constructor() {
        super();
        this.state =
            {
                userNow: [],
                correct: true
            }
    }
    componentDidMount() {
        getRedirectResult(auth)
            .then((result) => {
                // This gives you a Google Access Token. You can use it to access Google APIs.
                const credential = GoogleAuthProvider.credentialFromResult(result);
                const token = credential.accessToken;

                // The signed-in user info.
                const user = result.user;
                this.setState(prevState => ({
                    userNow: [...prevState.userNow, user]
                }))

            }).catch((error) => {
            // Handle Errors here.
            const errorCode = error.code;
            const errorMessage = error.message;
            // The email of the user's account used.
            const email = error.customData.email;
            // The AuthCredential type that was used.
            const credential = GoogleAuthProvider.credentialFromError(error);
            // ...
        });
    }

    render()
    {
        if(this.state.userNow.length === 0)
        {
            return (
                <div style={{textAlign: "center"}}>
                    <h1 style={{marginTop: '8%', fontSize: '9vh', fontFamily: 'Newslab, georgia, Bakersville'}}>OffCampus@Mac</h1>
                    <h2 style={{fontSize: '4vh', fontFamily: 'Newslab, georgia, Bakersville'}}>Please Proceed Below</h2>
                    <PrimaryButton text="Login" onClick={signIn} allowDisabledFocus/>
                </div>
            );
        }
        else
        {
            if(this.state.userNow[0].email.slice(this.state.userNow[0].email.length - 15) === "@macalester.edu")
            {
                return (
                    <App userNow={this.state.userNow}/>
                );
            }
            else
            {
                return (
                    <>
                        <div style={{textAlign: "center"}}>
                            <h1 style={{marginTop: '8%', fontSize: '9vh', fontFamily: 'Newslab, georgia, Bakersville'}}>Sorry, the page unavailable with your current account</h1>
                            <h1 style={{marginTop: '8%', fontSize: '6vh', fontFamily: 'Newslab, georgia, Bakersville'}}>Try Logging in with a <b>valid</b> Macalester Email</h1>
                        </div>
                    </>
                );
            }
        }
    }

}

export default landingPage