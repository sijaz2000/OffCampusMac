import '../../CSS/index.css'
import * as React from "react";
import SingleList from "./SingleListingDisplay";
import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, onValue } from "firebase/database";
import { getStorage, ref as reff, uploadBytes, getDownloadURL } from "firebase/storage";
import {DropzoneDialog} from 'material-ui-dropzone'
import { Stack, IStackProps, TextField, initializeIcons} from '@fluentui/react';
import { Dropdown, DropdownMenuItemType, IDropdownOption, IDropdownStyles } from '@fluentui/react/lib/Dropdown';
import { PrimaryButton } from '@fluentui/react/lib/Button';
import Profile from '../Profile/profile'

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





// **********************************************  FILTER SECTION  ***************************************************


const dropdownStyles: Partial<IDropdownStyles> = { dropdown: { width: 300 } };
const dropdownStylesPhone: Partial<IDropdownStyles> = { dropdown: { width: 240 } };
const dropdownStylesPhone2: Partial<IDropdownStyles> = { dropdown: { width: 160 } };
initializeIcons()

const filterProps = [
        {
            key: 'Header1',
            text: 'Room Filters',
            itemType: DropdownMenuItemType.Header
        },
        {
            key: 'byRooms1',
            text: '1 Room'
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
            itemType: DropdownMenuItemType.Header
        },
        {
            key: 'byBathrooms1',
            text: '1 Bathroom'
        },
        {
            key: 'byBathrooms2',
            text: '2+ Bathrooms'
        },
        {
            key: 'byBathrooms3',
            text: '3+ Bathrooms'
        },
        {
            key: 'Header3',
            text: 'Type Filters',
            itemType: DropdownMenuItemType.Header
        },
        {
            key: 'Lease',
            text: 'For Lease'
        },
        {
            key: 'subletWinter',
            text: 'Winter Sublet'
        },      {
            key: 'subletSummer',
            text: 'Summer Sublet'
        },
];

const typeProps = [
    {
        key: 'typeHeader',
        text: 'Type of Listing',
        itemType: DropdownMenuItemType.Header
    },
    {
        key: 'lease',
        text: 'Lease'
    },
    {
        key: 'winterSublet',
        text: 'Sublet for Winter'
    },
    {
        key: 'summerSublet',
        text: 'Sublet for Summer'
    }
];

const menuProps = [
        // {
        //     key: "blank",
        //     text: "Reset"
        //
        // },
        {
            key: 'FirstHeader',
            text: 'Rent Sorts',
            itemType: DropdownMenuItemType.Header
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
            itemType: DropdownMenuItemType.Header
        },
        {
            key: 'byDistance',
            text: 'Distance: Low to High'
        },
        {
            key: 'byDistance2',
            text: 'Distance: High to Low'
        }
];

// ********************************************  FILTER SECTION END ****************************************************

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const storage = getStorage();

const columnProps: Partial<IStackProps> = {
    tokens: { childrenGap: 15 },
    styles: { root: { width: 300} },
};

const columnPropsPhone: Partial<IStackProps> = {
    tokens: { childrenGap: 15 },
    styles: { root: { width: 240, marginLeft: "20%"} },
};

const columnProps2: Partial<IStackProps> = {
    tokens: { childrenGap: 15 },
    styles: { root: { width: 300} },
};

function makeid(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( let i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

// *************************************   This is where the class starts   ******************************************
class AddListings extends React.Component
{
    constructor() {
        super();
        this.state=
        {
            listings: [],
            able: false,
            listAddresses: [],
            files: [],
            open: false,
            selectedKeys: [],
            showListings: [],
            sortKey: '',
            typeKey: '',
            typeText: '',
            userNow: [],
            userListings: [],
            matches: window.matchMedia("(min-width: 680px)").matches

        }
    }

    componentDidMount() {
        const handler = e => this.setState({matches: e.matches});
        window.matchMedia("(min-width: 680px)").addEventListener('change', handler);
        this.readUserData();
    }

    sort = () =>
    {
        // if(this.state.sortKey === "blank" || this.state.sortKey === "")
        // {
        //     console.log("reached")
        //     this.setState(() => ({
        //         showListings: this.state.listings
        //     }))
        // }
        if(this.state.sortKey === "byRent")
        {
            this.setState(prevState => ({
                showListings: [prevState.showListings[0].sort(function (a, b)
                    {
                        return Number(a.rent) - Number(b.rent);
                    }
                )]
            }))
        }
        else if (this.state.sortKey === "byRent2")
        {
            this.setState(prevState => ({
                showListings: [prevState.showListings[0].sort(function (a, b)
                    {
                        console.log(a.rent)
                        console.log(b.rent)
                        return Number(b.rent) - Number(a.rent);
                    }
                )]
            }))
        }
    }


    filter = () =>
    {
        this.setState(prevState => ({
            showListings: this.state.listings
        }))
        if(this.state.selectedKeys.length === 0)
        {
            console.log("reached empty")
            this.setState(prevState => ({
                showListings: this.state.listings
            }))
        }
        else
        {
            for (let key = 0; key < this.state.selectedKeys.length; key++)
            {
                if (this.state.selectedKeys[key] === 'subletSummer')
                {
                    this.setState(prevState => ({
                        showListings: [prevState.showListings[0].filter(function (el)
                            {
                                return el.listingType === "Sublet for Summer";
                            }
                        )]
                    }))
                }
                if (this.state.selectedKeys[key] === 'subletWinter')
                {
                    this.setState(prevState => ({
                        showListings: [prevState.showListings[0].filter(function (el)
                            {
                                return el.listingType === "Sublet for Winter";
                            }
                        )]
                    }))
                }
                if (this.state.selectedKeys[key] === 'Lease')
                {
                    this.setState(prevState => ({
                        showListings: [prevState.showListings[0].filter(function (el)
                            {
                                return el.listingType === "Lease";
                            }
                        )]
                    }))
                }
                if (this.state.selectedKeys[key] === 'byRooms1')
                {
                    this.setState(prevState => ({
                        showListings: [prevState.showListings[0].filter(function (el)
                            {
                                return Number(el.numberRooms) === 1;
                            }
                        )]
                    }))
                }
                if (this.state.selectedKeys[key] === 'byRooms2')
                {
                    this.setState(prevState => ({
                        showListings: [prevState.showListings[0].filter(function (el)
                            {
                                return Number(el.numberRooms) >= 2;
                            }
                        )]
                    }))
                }
                if (this.state.selectedKeys[key] === 'byRooms3')
                {
                    this.setState(prevState => ({
                        showListings: [prevState.showListings[0].filter(function (el)
                            {
                                return Number(el.numberRooms) >= 3;
                            }
                        )]
                    }))

                }
                if (this.state.selectedKeys[key] === 'byBathrooms1')
                {
                    this.setState(prevState => ({
                        showListings: [prevState.showListings[0].filter(function (el)
                            {
                                return Number(el.numberBathrooms) === 1;
                            }
                        )]
                    }))
                }
                if (this.state.selectedKeys[key] === 'byBathrooms2')
                {
                    this.setState(prevState => ({
                        showListings: [prevState.showListings[0].filter(function (el)
                            {
                                return Number(el.numberBathrooms) >= 2;
                            }
                        )]
                    }))
                }
                if (this.state.selectedKeys[key] === 'byBathrooms3')
                {
                    this.setState(prevState => ({
                        showListings: [prevState.showListings[0].filter(function (el)
                            {
                                return Number(el.numberBathrooms) >= 3;
                            }
                        )]
                    }))

                }
            }
        }

    }

    readUserData = () =>
    {

        const listRef = ref(database, 'items');
        let tempListings = []
        let tempShowListings = []
        let tempAddresses = []
        onValue(listRef, (snapshot) => {
            snapshot.forEach(function(childSnapshot)
            {
                console.log(childSnapshot.val().reservedBy)
                if(childSnapshot.val().reservedBy === "None")
                {
                    tempShowListings.push(childSnapshot.val())
                }
                tempListings.push(childSnapshot.val())
                tempAddresses.push(childSnapshot.val().address.toLowerCase())

            })
        });
        this.setState(prevState => ({
            listings: [...prevState.listings, tempListings]
        }))
        this.setState(prevState => ({
            showListings: [...prevState.showListings, tempListings]
        }))
        this.setState(prevState => ({
            listAddresses: [...prevState.listAddresses, tempAddresses]
        }))

    }

    handleClose() {
        this.setState({
            open: false
        });
    }

    handleSave(files) {
        //Saving files to state for further use and closing Modal.
        this.setState({
            files: files,
            open: false
        });
    }

    handleOpen() {
        this.setState({
            open: true,
        });
    }

    writeUserData = () =>
    {
        if (!(document.getElementById("addressBox").value === "") && !(document.getElementById("nameBox").value === "") &&
            !(document.getElementById("rentBox").value === "") && !(isNaN(Number(document.getElementById("rentBox").value)))
            && !(document.getElementById("rentBox").value.includes(",")) && !(Number(document.getElementById("rentBox").value) > 100000) && !(Number(document.getElementById("rentBox").value) < 0) && !(document.getElementById("bathroomBox").value === "")
            && !(document.getElementById("roomBox").value === "") && !(isNaN(Number(document.getElementById("bathroomBox").value)))
            && !(isNaN(Number(document.getElementById("roomBox").value))) && !(this.state.typeKey === "") && !(Number(document.getElementById("roomBox").value) > 100) && !(Number(document.getElementById("roomBox").value) < 0) && !(Number(document.getElementById("bathroomBox").value) > 100) && !(Number(document.getElementById("bathroomBox").value) < 0)
            && !(document.getElementById("detailBox").value === "")  && !(document.getElementById("descriptionBox").value === "") && !(this.state.files.length === 0))
        {
            if(this.state.listAddresses[0].includes(document.getElementById("addressBox").value.toLowerCase()))
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
                            email: this.props.userNow[0].email,
                            address: document.getElementById("addressBox").value,
                            rent: document.getElementById("rentBox").value,
                            photo: url,
                            details: document.getElementById("detailBox").value,
                            numberRooms: document.getElementById("roomBox").value,
                            numberBathrooms: document.getElementById("bathroomBox").value,
                            listingType: this.state.typeText,
                            reservedBy: "None"
                        });

                        alert("Success! Please refresh page to see changes!")
                    })
                });

            }
        }
        else
        {
            alert("Missing Required fields or Incorrect Format")
        }
    }

    enable = () =>
    {
        this.setState(prevState => ({able: !prevState.able}));
    }

    onChangeSelect = (event: React.FormEvent<HTMLDivElement>, item: IDropdownOption) =>
    {
        if(item)
        {
            this.setState(prevState => ({
                typeKey: item.key.toString()
            }))
            this.setState(prevState => ({
                typeText: item.text.toString()
            }))
        }

    }

    onChangeSort = (event: React.FormEvent<HTMLDivElement>, item: IDropdownOption) =>
    {
        if (item)
        {
            this.setState(prevState => ({
                sortKey: item.key.toString()
            }))
        }
    }


    onChange = (event: React.FormEvent<HTMLDivElement>, item: IDropdownOption) =>
    {
        if (item)
        {
            this.setState(prevState => ({
                selectedKeys: item.selected ? [...prevState.selectedKeys, item.key.toString()] : prevState.selectedKeys.filter(key => key !== item.key)
            }))
        }
    }

    render()
    {
        if(!this.state.able)
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
                     {this.state.matches && (
                         <div style={{display: "flex", justifyContent: "space-evenly"}}>
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
                             <TextField label="Number Of Rooms" required id={"roomBox"} onGetErrorMessage={value => {
                                 if (value==="") {
                                     return 'This field is required';
                                 }
                                 else if(isNaN(Number(value)))
                                 {
                                     return "Please enter as a number"
                                 }
                                 else if (value.includes(","))
                                 {
                                     return "Enter the number without any commas"
                                 }
                             }}/>
                         </Stack>
                         <Stack {...columnProps2}>
                             <TextField label="Rent" required id={"rentBox"} onGetErrorMessage={value => {
                                 if (value==="") {
                                     return 'This field is required';
                                 }
                                 else if(isNaN(Number(value)))
                                 {
                                     return "Please enter as a number"
                                 }
                                 else if (value.includes(","))
                                 {
                                     return "Enter the number without any commas"
                                 }
                             }}/>
                             <TextField label="Short Paragraph for Details" multiline autoAdjustHeight required id={"detailBox"} onGetErrorMessage={value => {
                                 if (value === "") {
                                     return 'This field is required';
                                 }
                             }}/>
                             <TextField label="Number Of Bathrooms" required id={"bathroomBox"} onGetErrorMessage={value => {
                                 if (value==="") {
                                     return 'This field is required';
                                 }
                                 else if(isNaN(Number(value)))
                                 {
                                     return "Please enter as a number"
                                 }
                                 else if (value.includes(","))
                                 {
                                     return "Enter the number without any commas"
                                 }
                             }}/>

                             <Dropdown
                                 placeholder="Select Type"
                                 label="Type of Listing"
                                 selectedKey={this.state.typeKey}
                                 // eslint-disable-next-line react/jsx-no-bind
                                 onChange={this.onChangeSelect}
                                 options={typeProps}
                                 styles={dropdownStyles}
                             />
                         </Stack>
                     </div>)}

                     {!this.state.matches && (
                         <>
                         <Stack {...columnPropsPhone}>
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
                             <TextField label="Number Of Rooms" required id={"roomBox"} onGetErrorMessage={value => {
                                 if (value==="") {
                                     return 'This field is required';
                                 }
                                 else if(isNaN(Number(value)))
                                 {
                                     return "Please enter as a number"
                                 }
                                 else if (value.includes(","))
                                 {
                                     return "Enter the number without any commas"
                                 }
                             }}/>

                             <TextField label="Rent" required id={"rentBox"} onGetErrorMessage={value => {
                                 if (value==="") {
                                     return 'This field is required';
                                 }
                                 else if(isNaN(Number(value)))
                                 {
                                     return "Please enter as a number"
                                 }
                                 else if (value.includes(","))
                                 {
                                     return "Enter the number without any commas"
                                 }
                             }}/>
                             <TextField label="Short Paragraph for Details" multiline autoAdjustHeight required id={"detailBox"} onGetErrorMessage={value => {
                                 if (value === "") {
                                     return 'This field is required';
                                 }
                             }}/>
                             <TextField label="Number Of Bathrooms" required id={"bathroomBox"} onGetErrorMessage={value => {
                                 if (value==="") {
                                     return 'This field is required';
                                 }
                                 else if(isNaN(Number(value)))
                                 {
                                     return "Please enter as a number"
                                 }
                                 else if (value.includes(","))
                                 {
                                     return "Enter the number without any commas"
                                 }
                             }}/>

                             <Dropdown
                                 placeholder="Select Type"
                                 label="Type of Listing"
                                 selectedKey={this.state.typeKey}
                                 // eslint-disable-next-line react/jsx-no-bind
                                 onChange={this.onChangeSelect}
                                 options={typeProps}
                                 styles={dropdownStylesPhone}
                             />
                         </Stack>
                     </>)}
                     <br/>
                     {this.state.matches && (
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
                         </div>)}

                     {!this.state.matches && (
                         <div style={{display: 'flex', marginLeft: "17%"}}>
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
                             <br/>
                             <PrimaryButton text="Add Listing" onClick={this.writeUserData} style={{ marginLeft: "5%", backgroundColor: 'green'}} allowDisabledFocus/>
                         </div>)}
                     <div className="separator"/>
                     <Profile userNow={this.props.userNow} listings={this.state.listings}/>
                 </>

             );
            // *************************************   AFTER RE RENDER  ************************************************
        }
        else
        {
            console.log(this.state.selectedKeys)
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
                    {this.state.matches && (
                        <div style={{display: "flex", justifyContent: "space-evenly"}}>

                        <div>
                            <Dropdown
                                placeholder="Filter by"
                                label="Filter Listings"
                                selectedKeys={this.state.selectedKeys}
                                // eslint-disable-next-line react/jsx-no-bind
                                onChange={this.onChange}
                                multiSelect
                                options={filterProps}
                                styles={dropdownStyles}
                            />
                            <br/>
                            <PrimaryButton text="Set Filter" onClick={this.filter}  allowDisabledFocus style={{marginLeft: "7vw"}}/>
                        </div>

                        <div>
                            <Dropdown
                                placeholder="Sort By"
                                label="Sort Listings"
                                selectedKey={this.state.sortKey}
                                // eslint-disable-next-line react/jsx-no-bind
                                onChange={this.onChangeSort}
                                options={menuProps}
                                styles={dropdownStyles}
                            />
                            <br/>
                            <PrimaryButton text="Set Sort" onClick={this.sort}  allowDisabledFocus style={{marginLeft: "7vw"}}/>
                        </div>

                    </div>)}

                    {!this.state.matches && (
                        <div style={{display: "flex", justifyContent: "space-evenly"}}>

                        <div>
                            <Dropdown
                                placeholder="Filter by"
                                label="Filter Listings"
                                selectedKeys={this.state.selectedKeys}
                                // eslint-disable-next-line react/jsx-no-bind
                                onChange={this.onChange}
                                multiSelect
                                options={filterProps}
                                styles={dropdownStylesPhone2}
                            />
                            <br/>
                            <PrimaryButton text="Set Filter" onClick={this.filter}  allowDisabledFocus style={{marginLeft: "7vw"}}/>
                        </div>

                        <div>
                            <Dropdown
                                placeholder="Sort By"
                                label="Sort Listings"
                                selectedKey={this.state.sortKey}
                                // eslint-disable-next-line react/jsx-no-bind
                                onChange={this.onChangeSort}
                                options={menuProps}
                                styles={dropdownStylesPhone2}
                            />
                            <br/>
                            <PrimaryButton text="Set Sort" onClick={this.sort}  allowDisabledFocus style={{marginLeft: "7vw"}}/>
                        </div>

                    </div>)}

                    <ul>
                        {this.state.showListings[0].map((data) => (
                            <li key={data.address}>
                                <SingleList description={data.description} name={data.name} address={data.address} email={data.email} rent={data.rent} image={data.photo} details={data.details} rooms={data.numberRooms} bathrooms={data.numberBathrooms} type={data.listingType} userNow={this.props.userNow} reserved={data.reservedBy}/>
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
                    {this.state.matches && (
                        <div style={{display: "flex", justifyContent: "space-evenly"}}>
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
                                <TextField label="Number Of Rooms" required id={"roomBox"} onGetErrorMessage={value => {
                                    if (value==="") {
                                        return 'This field is required';
                                    }
                                    else if(isNaN(Number(value)))
                                    {
                                        return "Please enter as a number"
                                    }
                                    else if (value.includes(","))
                                    {
                                        return "Enter the number without any commas"
                                    }
                                }}/>
                            </Stack>
                            <Stack {...columnProps2}>
                                <TextField label="Rent" required id={"rentBox"} onGetErrorMessage={value => {
                                    if (value==="") {
                                        return 'This field is required';
                                    }
                                    else if(isNaN(Number(value)))
                                    {
                                        return "Please enter as a number"
                                    }
                                    else if (value.includes(","))
                                    {
                                        return "Enter the number without any commas"
                                    }
                                }}/>
                                <TextField label="Short Paragraph for Details" multiline autoAdjustHeight required id={"detailBox"} onGetErrorMessage={value => {
                                    if (value === "") {
                                        return 'This field is required';
                                    }
                                }}/>
                                <TextField label="Number Of Bathrooms" required id={"bathroomBox"} onGetErrorMessage={value => {
                                    if (value==="") {
                                        return 'This field is required';
                                    }
                                    else if(isNaN(Number(value)))
                                    {
                                        return "Please enter as a number"
                                    }
                                    else if (value.includes(","))
                                    {
                                        return "Enter the number without any commas"
                                    }
                                }}/>

                                <Dropdown
                                    placeholder="Select Type"
                                    label="Type of Listing"
                                    selectedKey={this.state.typeKey}
                                    // eslint-disable-next-line react/jsx-no-bind
                                    onChange={this.onChangeSelect}
                                    options={typeProps}
                                    styles={dropdownStyles}
                                />
                            </Stack>
                        </div>)}

                    {!this.state.matches && (
                        <>
                            <Stack {...columnPropsPhone}>
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
                                <TextField label="Number Of Rooms" required id={"roomBox"} onGetErrorMessage={value => {
                                    if (value==="") {
                                        return 'This field is required';
                                    }
                                    else if(isNaN(Number(value)))
                                    {
                                        return "Please enter as a number"
                                    }
                                    else if (value.includes(","))
                                    {
                                        return "Enter the number without any commas"
                                    }
                                }}/>

                                <TextField label="Rent" required id={"rentBox"} onGetErrorMessage={value => {
                                    if (value==="") {
                                        return 'This field is required';
                                    }
                                    else if(isNaN(Number(value)))
                                    {
                                        return "Please enter as a number"
                                    }
                                    else if (value.includes(","))
                                    {
                                        return "Enter the number without any commas"
                                    }
                                }}/>
                                <TextField label="Short Paragraph for Details" multiline autoAdjustHeight required id={"detailBox"} onGetErrorMessage={value => {
                                    if (value === "") {
                                        return 'This field is required';
                                    }
                                }}/>
                                <TextField label="Number Of Bathrooms" required id={"bathroomBox"} onGetErrorMessage={value => {
                                    if (value==="") {
                                        return 'This field is required';
                                    }
                                    else if(isNaN(Number(value)))
                                    {
                                        return "Please enter as a number"
                                    }
                                    else if (value.includes(","))
                                    {
                                        return "Enter the number without any commas"
                                    }
                                }}/>

                                <Dropdown
                                    placeholder="Select Type"
                                    label="Type of Listing"
                                    selectedKey={this.state.typeKey}
                                    // eslint-disable-next-line react/jsx-no-bind
                                    onChange={this.onChangeSelect}
                                    options={typeProps}
                                    styles={dropdownStylesPhone}
                                />
                            </Stack>
                        </>)}
                    <br/>
                    {this.state.matches && (
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
                        </div>)}

                    {!this.state.matches && (
                        <div style={{display: 'flex', marginLeft: "17%"}}>
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
                            <br/>
                            <PrimaryButton text="Add Listing" onClick={this.writeUserData} style={{ marginLeft: "5%", backgroundColor: 'green'}} allowDisabledFocus/>
                        </div>)}

                    <div className="separator"/>
                    <Profile userNow={this.props.userNow} listings={this.state.listings}/>
                </>
            );
        }
    }
}

export default AddListings;