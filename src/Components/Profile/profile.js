import '../../CSS/index.css'
import * as React from "react";
import { PrimaryButton } from '@fluentui/react/lib/Button';
import { initializeApp } from "firebase/app";
import {GoogleAuthProvider,
getAuth,
 signInWithRedirect}
from "firebase/auth";
import SingleList3 from "../Listings/SingleListingDisplay3";
import SingleList2 from "../Listings/SingleListingDisplay2";
import {IStackProps} from '@fluentui/react/lib/Stack';

// import {getFirestore, query, getDocs, collection, where, addDoc,} from "firebase/firestore";

const columnProps: Partial<IStackProps> = {
    styles: { root: { maxWidth: "53vh" }, tokens: { childrenGap:15 } },
};

const firebaseConfig = {
    apiKey: "AIzaSyCxyu7ou0WSzQYk63StiYtCVG-XtUPpqNs",
    authDomain: "offcampusatmac.firebaseapp.com",
    projectId: "offcampusatmac",
    storageBucket: "offcampusatmac.appspot.com",
    messagingSenderId: "546109308935",
    appId: "1:546109308935:web:a52c2ee6d7cc1bae822aa2",
    measurementId: "G-7CFVGFQXE8",
    databaseURL: "https://offcampusatmac-default-rtdb.firebaseio.com/"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth()
const provider = new GoogleAuthProvider();
// const db = getFirestore(app);

const signIn = () =>
{
    signInWithRedirect(auth, provider)
}

// const provider = new GoogleAuthProvider()
// const signInWithGoogle = async () => {
//     try {
//         const res = await signInWithRedirect(auth, googleProvider);
//         const user = res.user;
//         const q = query(collection(db, "users"), where("uid", "==", user.uid));
//         const docs = await getDocs(q);
//         if (docs.docs.length === 0) {
//             await addDoc(collection(db, "users"), {
//                 uid: user.uid,
//                 name: user.displayName,
//                 authProvider: "google",
//                 email: user.email,
//             });
//         }
//         console.log(user.displayName)
//     } catch (err) {
//         console.error(err);
//         alert(err.message);
//     }
// };
//
// const logout = () => {
//     signOut(auth);
// };

class Profile extends React.Component
{
    constructor() {
        super();
        this.state =
            {
                truth: false,
                truthR: false,
                myListings: [],
                myReserved: [],
                matches: window.matchMedia("(min-width: 680px)").matches
            }
    }

    componentDidMount() {
        const handler = e => this.setState({matches: e.matches});
        window.matchMedia("(min-width: 680px)").addEventListener('change', handler);
    }

    makeArray = () =>
    {
        let emailNow = this.props.userNow[0].email
        let tempList = []
        this.props.listings[0].map((function(elem)
        {
            if(elem.email === emailNow)
            {
                tempList.push(elem)
            }
        }))
        console.log(tempList)
        this.setState(prevState => ({
            myListings: [...prevState.myListings, tempList]
        }))
    }

    makeReserveArray = () =>
    {
        let emailNow = this.props.userNow[0].email
        let tempListReserve = []
        this.props.listings[0].map((function(elem)
        {
            if(elem.reservedBy === emailNow)
            {
                tempListReserve.push(elem)
            }
        }))
        this.setState(prevState => ({
            myReserved: [...prevState.myReserved, tempListReserve]
        }))

    }

    enable = () =>
    {
        console.log(this.state.truthR)
        if(this.state.truthR)
        {
            this.setState(prevState => ({truthR: !prevState.truthR}));
        }
        console.log(this.props.listings[0])
        this.makeArray();
        this.setState(prevState => ({truth: !prevState.truth}));

    }

    enableReserve = () =>
    {
        if(this.state.truth)
        {
            this.setState(prevState => ({truth: !prevState.truth}));
        }
        this.makeReserveArray();
        this.setState(prevState => ({truthR: !prevState.truthR}));
    }

    render()
    {
        if (this.props.userNow.length === 0)
        {
            return (
                <>
                    <div style={{position: 'relative'}}>
                        <div style={{textAlign: 'center', paddingLeft: '10%',bottom: '35%',paddingRight: '10%'}}>
                            <section id={"profile"}>
                                <h1 style={{fontSize: '6vh', fontFamily: 'Newslab, georgia, Bakersville', color: '#000000'}}>Your Profile</h1>
                            </section>
                            <br/>
                            <PrimaryButton text="Login" onClick={signIn} allowDisabledFocus/>
                        </div>
                    </div>
                    <div className="separator" />
                </>
            );
        }
        else
        {
            let photoUrl = this.props.userNow[0].photoURL;
            const newP = "s400-c";
            const oldP = /s96-c/;
            let photoUrl1 = photoUrl.replace(oldP, newP)
            if(!this.state.truth)
            {
                if(this.state.truthR)
                {
                    return (
                        <>
                            <div style={{position: 'relative'}}>
                                <div style={{textAlign: 'center', paddingLeft: '10%',bottom: '35%',paddingRight: '10%'}}>
                                    <section id={"profile"}>
                                        <h1 style={{fontSize: '6vh', fontFamily: 'Newslab, georgia, Bakersville', color: '#000000'}}>{this.props.userNow[0].displayName}</h1>
                                    </section>
                                    <br/>
                                </div>
                                <div style={{textAlign: "center"}}>
                                    <img src={photoUrl1} alt={"none"} style={{width: "30vh", height: "30vh", borderRadius: "100%"}}/>
                                </div>
                                <br/>

                                {this.state.matches && (
                                    <div style={{textAlign: "center", display: "flex", justifyContent: "space-around"}}>
                                        <PrimaryButton text="Show Your Listings" onClick={this.enable} allowDisabledFocus/>
                                        <PrimaryButton text="Hide Reserved Listings" onClick={this.enableReserve} allowDisabledFocus/>
                                    </div>)}
                                {!this.state.matches && (
                                    <div style={{textAlign: "center", display: "flex", marginLeft: "29%"}}>
                                        <PrimaryButton style={{width: "15%"}} text="Your Listings" onClick={this.enable} allowDisabledFocus/>
                                        <PrimaryButton style={{width: "15%", marginLeft: "10%"}} text="Hide Listings" onClick={this.enableReserve} allowDisabledFocus/>
                                    </div>)}

                            </div>
                            <ul>
                                {this.state.myReserved[0].map((data) => (

                                    <li key={data.address}>
                                        <SingleList3 description={data.description} name={data.name} address={data.address} email={data.email} rent={data.rent} image={data.photo} details={data.details} rooms={data.numberRooms} bathrooms={data.numberBathrooms}  userNow={this.props.userNow} type={data.listingType}/>
                                    </li>
                                ))}
                            </ul>
                            <div className="separator" />
                        </>

                    )
                }
                else
                {
                    return (
                        <>
                            <div style={{position: 'relative'}}>
                                <div style={{textAlign: 'center', paddingLeft: '10%',bottom: '35%',paddingRight: '10%'}}>
                                    <section id={"profile"}>
                                        <h1 style={{fontSize: '6vh', fontFamily: 'Newslab, georgia, Bakersville', color: '#000000'}}>{this.props.userNow[0].displayName}</h1>
                                    </section>
                                    <br/>
                                </div>
                                <div style={{textAlign: "center"}}>
                                    <img src={photoUrl1} alt={"none"} style={{width: "30vh", height: "30vh", borderRadius: "100%"}}/>
                                </div>
                                <br/>
                                {this.state.matches && (
                                    <div style={{textAlign: "center", display: "flex", justifyContent: "space-around"}}>
                                    <PrimaryButton text="Show Your Listings" onClick={this.enable} allowDisabledFocus/>
                                    <PrimaryButton text="Show Your Reserved Listings" onClick={this.enableReserve} allowDisabledFocus/>
                                </div>)}
                                {!this.state.matches && (
                                    <div style={{textAlign: "center", display: "flex", marginLeft: "29%"}}>
                                    <PrimaryButton style={{width: "15%"}} text="Your Listings" onClick={this.enable} allowDisabledFocus/>
                                    <PrimaryButton style={{width: "15%", marginLeft: "10%"}} text="Reserved Listings" onClick={this.enableReserve} allowDisabledFocus/>
                                </div>)}
                            </div>
                            <div className="separator" />
                        </>

                    )
                }
            }
            else
            {
                return (
                    <>
                        <div style={{position: 'relative'}}>
                            <div style={{textAlign: 'center', paddingLeft: '10%',bottom: '35%',paddingRight: '10%'}}>
                                <section id={"profile"}>
                                    <h1 style={{fontSize: '6vh', fontFamily: 'Newslab, georgia, Bakersville', color: '#000000'}}>{this.props.userNow[0].displayName}</h1>
                                </section>
                                <br/>
                            </div>
                            <div style={{textAlign: "center"}}>
                                <img src={photoUrl1} alt={"none"} style={{width: "30vh", height: "30vh", borderRadius: "100%"}}/>
                            </div>
                            <br/>
                            {this.state.matches && (
                                <div style={{textAlign: "center", display: "flex", justifyContent: "space-around"}}>
                                    <PrimaryButton text="Hide Your Listings" onClick={this.enable} allowDisabledFocus/>
                                    <PrimaryButton text="Show Your Reserved Listings" onClick={this.enableReserve} allowDisabledFocus/>
                                </div>)}
                            {!this.state.matches && (
                                <div style={{textAlign: "center", display: "flex", marginLeft: "29%"}}>
                                    <PrimaryButton style={{width: "15%"}} text="Hide Listings" onClick={this.enable} allowDisabledFocus/>
                                    <PrimaryButton style={{width: "15%", marginLeft: "10%"}} text="Reserved Listings" onClick={this.enableReserve} allowDisabledFocus/>
                                </div>)}
                        </div>
                        <ul>
                            {this.state.myListings[0].map((data) => (

                                <li key={data.address}>
                                    <SingleList2 description={data.description} name={data.name} address={data.address} email={data.email} rent={data.rent} image={data.photo} details={data.details} rooms={data.numberRooms} bathrooms={data.numberBathrooms}  userNow={this.props.userNow} type={data.listingType} reserved={data.reservedBy}/>
                                </li>
                            ))}
                        </ul>
                        <div className="separator" />
                    </>

                )

            }
        }
    }
}

export default Profile;