import '../../CSS/index.css'
import * as React from "react";
import SingleList from "./SingleListingDisplay";
import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, onValue } from "firebase/database";
import { getStorage, ref as reff, uploadBytes, getDownloadURL } from "firebase/storage";
import {DropzoneDialog} from 'material-ui-dropzone'
import {ComboBox, IComboBoxOption, IComboBox, IComboBoxStyles, Stack, IStackProps, TextField, SelectableOptionMenuItemType} from '@fluentui/react';
import { PrimaryButton } from '@fluentui/react/lib/Button';


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


// ***********************************************  FILTER SECTION  ****************************************************

const filterProps: IComboBoxOption[] = [
    {
        key: 'Header1',
        text: 'Room Filters',
        itemType: SelectableOptionMenuItemType.Header
    },
    {
        key: 'byRooms1',
        text: '1+ Room'
    },
    {
        key: 'byRooms2',
        text: '2+ Rooms'
    },
    {
        key: 'byRooms3',
        text: '3+ Rooms'
    },
    {
        key: 'Header2',
        text: 'Bathroom Filters',
        itemType: SelectableOptionMenuItemType.Header
    },
    {
        key: 'byBathrooms2',
        text: '2+ Bathrooms'
    },
    {
        key: 'byBathrooms3',
        text: '3+ Bathrooms'
    }
];

const menuProps: IComboBoxOption[] = [


    {
        key: "blank",
        text: ""

    },
    {
        key: 'FirstHeader',
        text: 'Rent Sorts',
        itemType: SelectableOptionMenuItemType.Header
    },
    {
        key: 'byRent',
        text: 'Rent: Low to High'
    },
    {
        key: 'byRent2',
        text: 'Rent: High to Low'
    },
    {
        key: 'SecondHeader',
        text: 'Distance Sorts',
        itemType: SelectableOptionMenuItemType.Header
    },
    {
        key: 'byDistance',
        text: 'Distance: Low to High'
    },
    {
        key: '',
        text: 'Distance: High to Low'
    }
];

function _onMenuClick(ev?: React.SyntheticEvent<any>) {
    console.log(ev);
}

// ********************************************  FILTER SECTION END ****************************************************


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const storage = getStorage();

const columnProps: Partial<IStackProps> = {
    tokens: { childrenGap: 15 },
    styles: { root: { width: 300, marginLeft: '30%' } },
};

const columnProps2: Partial<IStackProps> = {
    tokens: { childrenGap: 15 },
    styles: { root: { width: 300, marginLeft: '5%' } },
};

const filterProps2: Partial<IStackProps> = {
    tokens: { childrenGap: 10 },
    styles: { root: { width: 300, justifyContent: "space-between"} },
};

function makeid(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

const readUserData = () =>
{

    const listRef = ref(database, 'items');
    let tempListings = []
    let tempAddresses = []
    onValue(listRef, (snapshot) => {
        snapshot.forEach(function(childSnapshot)
        {
            tempListings.push(childSnapshot.val())
            tempAddresses.push(childSnapshot.val().address)
        })
    });
    this.setState(prevState => ({
        listings: [...prevState.listings, tempListings]
    }))
    this.setState(prevState => ({
        listAddresses: [...prevState.listAddresses, tempAddresses]
    }))
}

function handleClose() {
    this.setState({
        open: false
    });
}

function handleSave(files) {
    //Saving files to state for further use and closing Modal.
    this.setState({
        files: files,
        open: false
    });
}

function handleOpen() {
    this.setState({
        open: true,
    });
}

const writeUserData = () =>
{
    if (!(document.getElementById("addressBox").value === "") && !(document.getElementById("nameBox").value === "") &&
        !(document.getElementById("rentBox").value === "") && !(document.getElementById("emailBox").value === ""))
    {
        if(this.state.listAddresses[0].includes(document.getElementById("addressBox").value))
        {
            alert("This listing already exists");
        }
        else
        {
            const string = makeid(10);
            const storageRef = reff(storage, string);
            uploadBytes(storageRef, this.state.files[0]).then((snapshot) => {
                console.log('Uploaded a blob or file!');
                getDownloadURL(storageRef).then((url) =>
                {
                    set(ref(database, 'items/' + document.getElementById("addressBox").value), {
                        description: document.getElementById("descriptionBox").value,
                        name: document.getElementById("nameBox").value,
                        email: document.getElementById("emailBox").value + "@macalester.edu",
                        address: document.getElementById("addressBox").value,
                        rent: document.getElementById("rentBox").value,
                        photo: url,
                        details: document.getElementById("detailBox").value
                    });

                    alert("Success! Please refresh page to see changes!")
                })
            });

        }
    }
}

const onChange = () =>
{

}

const enable = () =>
{
    this.setState(prevState => ({able: !prevState.able}));
}

// **************************************   This is where the class starts   *******************************************
const AddListings2: React.FunctionComponent = () =>
{
    let able = React.useState(false);


    React.useEffect()
    // constructor() {
    //     super();
    //     this.state=
    //         {
    //             listings: [],
    //             able: false,
    //             listAddresses: [],
    //             files: [],
    //             open: false,
    //             selectedKeys: []
    //         }
    // }
    //
    // componentDidMount() {
    //     this.readUserData();
    // }

    if(!able)
    {
        // *********************************************   BEFORE RE RENDER   **************************************
        return (
            <>
                <div style={{position: 'relative'}}>
                    <div style={{textAlign: 'center', paddingLeft: '10%', bottom: '35%', paddingRight: '10%'}}>
                        <section id={"listings"}>
                            <h1 style={{
                                fontSize: '6vh',
                                fontFamily: 'Newslab, georgia, Bakersville',
                                color: '#000000'
                            }}>Available Listings</h1>
                        </section>
                        <PrimaryButton text="Show Listings" onClick={this.enable} allowDisabledFocus/>
                    </div>
                </div>

                <div className="separator"/>

                <div style={{position: 'relative'}}>
                    <div style={{textAlign: 'center', paddingLeft: '10%', bottom: '35%', paddingRight: '10%'}}>
                        <section id={"addListing"}>
                            <h1 style={{fontSize: '6vh', fontFamily: 'Newslab, georgia, Bakersville', color: '#000000'}}>Add
                                a Listing</h1>
                        </section>
                    </div>
                </div>
                <div style={{display: "flex"}}>
                    <Stack {...columnProps}>
                        <TextField label="Name of Listing" autoAdjustHeight required id={"descriptionBox"} onGetErrorMessage={value => {
                            if (value === "") {
                                return 'This field is required';
                            }
                        }}/>
                        <TextField label="Name " required id={"nameBox"} onGetErrorMessage={value => {
                            if (value==="") {
                                return 'This field is required';
                            }
                        }} />
                        <TextField label="Listing Address" required id={"addressBox"} onGetErrorMessage={value => {
                            if (value==="") {
                                return 'This field is required';
                            }
                        }}/>
                    </Stack>
                    <Stack {...columnProps2}>
                        <TextField label="Contact Email" required mask="m\ask: @macalester.edu" id={"emailBox"} suffix="@macalester.edu"
                                   onGetErrorMessage={value => {
                                       if (value==="") {
                                           return 'This field is required';
                                       }
                                   }}/>
                        <TextField label="Rent" required id={"rentBox"} onGetErrorMessage={value => {
                            if (value==="") {
                                return 'This field is required';
                            }
                        }}/>
                        <TextField label="Short Paragraph for Details" multiline autoAdjustHeight required id={"detailBox"} onGetErrorMessage={value => {
                            if (value === "") {
                                return 'This field is required';
                            }
                        }}/>
                    </Stack>
                </div>
                <br/>
                <div style={{display: "flex"}}>
                    <div style={{marginLeft: '40%'}}>
                        <PrimaryButton onClick={this.handleOpen.bind(this)}>
                            Add Image
                        </PrimaryButton>
                        <DropzoneDialog
                            open={this.state.open}
                            onSave={this.handleSave.bind(this)}
                            acceptedFiles={['image/jpeg', 'image/png', 'image/bmp']}
                            showPreviews={true}
                            maxFileSize={5000000}
                            onClose={this.handleClose.bind(this)}
                        />
                    </div>


                    <br/>
                    <PrimaryButton text="Add Listing" onClick={this.writeUserData} style={{marginLeft: "5%", backgroundColor: 'green'}} allowDisabledFocus/>
                </div>
                <div className="separator"/>
            </>
        );
        // *************************************   AFTER RE RENDER  ************************************************
    }
    else
    {
        return (
            <>
                <div style={{position: 'relative'}}>
                    <div style={{textAlign: 'center', paddingLeft: '10%', bottom: '35%', paddingRight: '10%'}}>
                        <section id={"listings"}>
                            <h1 style={{
                                fontSize: '6vh',
                                fontFamily: 'Newslab, georgia, Bakersville',
                                color: '#000000'
                            }}>Available Listings</h1>
                        </section>
                        <PrimaryButton text="Hide Listings" onClick={this.enable}  allowDisabledFocus/>
                        {/*<div >*/}
                        {/*    /!*<ScrollablePane scrollContainerFocus={true} scrollContainerAriaLabel="Sticky component example"  styles={scrollablePaneStyles} scrollbarVisibility={ScrollbarVisibility}>*!/*/}
                        {/*    /!*    {this.state.listings[0].map(createContentArea)}*!/*/}
                        {/*    /!*</ScrollablePane>*!/*/}
                        {/*</div>*/}
                    </div>
                </div>
                <div style={{display: "flex", justifyContent: "space-around"}}>

                    <ComboBox
                        multiSelect
                        label="Filter By"
                        allowFreeform={true}
                        options={filterProps}
                        onChange={_onMenuClick}/>

                    <ComboBox
                        label="Sort By"
                        allowFreeform={true}
                        options={menuProps}
                        onChange={_onMenuClick}/>
                </div>
                <ul>
                    {this.state.listings[0].map((data) => (
                        <li key={data.address}>
                            <SingleList description={data.description} name={data.name} address={data.address} email={data.email} rent={data.rent} image={data.photo} details={data.details}/>
                        </li>
                    ))}
                </ul>
                <div className="separator"/>

                <div style={{position: 'relative'}}>
                    <div style={{textAlign: 'center', paddingLeft: '10%', bottom: '35%', paddingRight: '10%'}}>
                        <section id={"addListing"}>
                            <h1 style={{fontSize: '6vh', fontFamily: 'Newslab, georgia, Bakersville', color: '#000000'}}>Add
                                a Listing</h1>
                        </section>
                    </div>
                </div>
                <div style={{display: "flex"}}>
                    <Stack {...columnProps}>
                        <TextField label="Name of Listing" autoAdjustHeight required id={"descriptionBox"} onGetErrorMessage={value => {
                            if (value === "") {
                                return 'This field is required';
                            }
                        }}/>
                        <TextField label="Name " required id={"nameBox"} onGetErrorMessage={value => {
                            if (value==="") {
                                return 'This field is required';
                            }
                        }} />
                        <TextField label="Listing Address" required id={"addressBox"} onGetErrorMessage={value => {
                            if (value==="") {
                                return 'This field is required';
                            }
                        }}/>
                    </Stack>
                    <Stack {...columnProps2}>
                        <TextField label="Contact Email" required mask="m\ask: @macalester.edu" id={"emailBox"} suffix="@macalester.edu"
                                   onGetErrorMessage={value => {
                                       if (value==="") {
                                           return 'This field is required';
                                       }
                                   }}/>
                        <TextField label="Rent" required id={"rentBox"} onGetErrorMessage={value => {
                            if (value==="") {
                                return 'This field is required';
                            }
                        }}/>
                        <TextField label="Short Paragraph for Details" autoAdjustHeight required id={"detailBox"} onGetErrorMessage={value => {
                            if (value === "") {
                                return 'This field is required';
                            }
                        }}/>
                    </Stack>
                </div>
                <br/>
                <div style={{display: 'flex'}}>
                    <div style={{marginLeft: '40%'}}>
                        <PrimaryButton onClick={this.handleOpen.bind(this)}>
                            Add Image
                        </PrimaryButton>
                        <DropzoneDialog
                            open={this.state.open}
                            onSave={this.handleSave.bind(this)}
                            acceptedFiles={['image/jpeg', 'image/png', 'image/bmp']}
                            showPreviews={true}
                            maxFileSize={5000000}
                            onClose={this.handleClose.bind(this)}
                        />
                    </div>
                    <br/>
                    <PrimaryButton text="Add Listing" onClick={this.writeUserData} style={{marginLeft: "5%", backgroundColor: 'green'}} allowDisabledFocus/>
                </div>
                <div className="separator"/>
            </>
        );
    }
}

export default AddListings2;