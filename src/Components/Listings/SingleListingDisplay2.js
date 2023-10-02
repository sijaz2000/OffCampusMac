import React from 'react'
import Box from '@material-ui/core/Box';
import {IStackProps, Stack} from '@fluentui/react/lib/Stack';
import { PrimaryButton, IconButton, DefaultButton } from '@fluentui/react/lib/Button';
import {Modal, getTheme, mergeStyleSets, FontWeights, TextField,} from '@fluentui/react';
import {IButtonStyles} from "@fluentui/react";
import {IIconProps} from "@fluentui/react";
import { getDatabase, ref, set, onValue, remove } from "firebase/database";
import {initializeApp} from "firebase/app";
import {Dropdown, DropdownMenuItemType, IDropdownOption, IDropdownStyles} from "@fluentui/react/lib/Dropdown";


// const columnProps: Partial<IStackProps> = {
//     styles: { root: { maxWidth: "53vh" } },
// };

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
const database = getDatabase(app);

const cancelIcon: IIconProps = { iconName: 'Cancel' };

const theme = getTheme();
const contentStyles = mergeStyleSets({
    container: {
        display: 'flex',
        flexFlow: 'column nowrap',
        alignItems: 'stretch',
    },
    header: [
        theme.fonts.xLargePlus,
        {
            flex: '1 1 auto',
            borderTop: `4px solid ${theme.palette.themePrimary}`,
            color: theme.palette.neutralPrimary,
            display: 'flex',

            alignItems: 'center',
            fontWeight: FontWeights.semibold,
            padding: '12px 12px 14px 24px',
        },
    ],
    body: {
        flex: '4 4 auto',
        padding: '0 24px 24px 24px',
        overflowY: 'hidden',
        display: "flex",
        justifyContent: "space-between",
        selectors: {
            p: { margin: '14px 0' },
            'p:first-child': { marginTop: 0 },
            'p:last-child': { marginBottom: 0 },
        },
    },
});

const typeProps = [
    {
        key: 'typeHeader',
        text: 'Type of Listing',
        itemType: DropdownMenuItemType.Header
    },
    {
        key: "",
        text: ""
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

const dropdownStyles: Partial<IDropdownStyles> = { dropdown: { width: 300 } };

const columnProps: Partial<IStackProps> = {
    tokens: { childrenGap:15 },
    styles: { root: { width: "70vw", marginBottom: 10} },
};

const columnProps4: Partial<IStackProps> = {
    styles: { root: { maxWidth: "53vh" }, tokens: { childrenGap:15 } },
};

const columnProps2: Partial<IStackProps> = {
    tokens: { childrenGap:20 },
    styles: { root: { width: "50vw", marginBottom: 10, marginLeft: "42vw"} },
};

const columnProps3: Partial<IStackProps> = {
    tokens: { childrenGap:20 },
    styles: { root: { width: "10vw", marginBottom: 10, marginLeft: "6vw"} },
};

const iconButtonStyles: Partial<IButtonStyles> = {
    root: {
        color: theme.palette.neutralPrimary,
        marginLeft: 'auto',
        marginTop: '4px',
        marginRight: '2px',
    },
    rootHovered: {
        color: theme.palette.neutralDark,
    },
};



class SingleList2 extends React.Component
{
    constructor(props) {
        super(props);
        this.state =
            {
                extend: false,
                editModalOpen: false,
                deleteModalOpen: false,
                files: [],
                open: false,
                typeKey: '',
                typeText: '',
                matches: window.matchMedia("(min-width: 680px)").matches
            }

    }

    componentDidMount() {
        const handler = e => this.setState({matches: e.matches});
        window.matchMedia("(min-width: 680px)").addEventListener('change', handler);
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

    deleteListing = () =>
    {
        remove(ref(database, 'items/' + this.props.address)).then(() =>
        {
            alert("Successfully Deleted! Refresh Page to see changes")
            this.openDeleteModal();
            this.setToTrue();
            return true;
        })
    }

    editListing = () =>
    {
        remove(ref(database, 'items/' + this.props.address)).then(() =>
        {
            let newDescription = document.getElementById("descriptionsBox").value === "" ? this.props.description : document.getElementById("descriptionsBox").value;
            let newAddress = document.getElementById("addresssBox").value === "" ? this.props.address : document.getElementById("addresssBox").value;
            let newName = document.getElementById("namesBox").value === "" ? this.props.name : document.getElementById("namesBox").value;
            let newRooms = document.getElementById("roomsBox").value === "" ? this.props.rooms : document.getElementById("roomsBox").value;
            let newEmail = this.props.userNow[0].email;
            let newRent = document.getElementById("rentsBox").value === "" ? this.props.rent : document.getElementById("rentsBox").value;
            let newDetails = document.getElementById("detailsBox").value === "" ? this.props.details : document.getElementById("detailsBox").value;
            let newBathRooms = document.getElementById("bathroomsBox").value === "" ? this.props.bathrooms : document.getElementById("bathroomsBox").value;
            let newKey = this.state.typeKey === "" ? this.props.type : this.state.typeText
            if (!isNaN(Number(newRent)) && !isNaN(Number(newRooms)) && !isNaN(Number(newBathRooms)) && !(newRent.includes(",")) && !(Number(newRooms) > 100) && !(Number(newRooms) < 0) && !(Number(newBathRooms) > 100) && !(Number(newBathRooms) < 0)&& !(Number(newRent) > 100000) && !(Number(newRent) < 0))
            {
                set(ref(database, 'items/' + newAddress), {
                    description:  newDescription,
                    name: newName,
                    email: newEmail,
                    address: newAddress,
                    rent: newRent,
                    photo: this.props.image,
                    details: newDetails,
                    numberRooms: newRooms,
                    numberBathrooms: newBathRooms,
                    listingType: newKey,
                    reservedBy: this.props.reserved
                }).then(() =>
                {
                    alert("Success! Please refresh page to see changes!");
                    this.openEditModal();
                    this.setToTrue();
                    return "";
                })
            }
            else
            {
                alert("Incorrect format")
            }
        })
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

    setToTrue = () =>
    {
        this.setState(prevState => ({extend: !prevState.extend}));
    }

    openEditModal = () =>
    {
        this.setState(prevState => ({editModalOpen: !prevState.editModalOpen}));
    }

    openDeleteModal = () =>
    {
        this.setState(prevState => ({deleteModalOpen: !prevState.deleteModalOpen}));
    }

    render()
    {
        return (
            <>
                {this.state.matches && (
                    <>
                    <Box bgcolor="white" p={1} border={2} marginRight={12} marginLeft={10}>
                        <b style={{textAlign: "center", fontSize: '150%', marginLeft: "1%"}}>{this.props.description}</b>

                        <div style={{justifyContent: "space-between", display: "flex", fontSize: '2vh'}}>
                            <b style={{textAlign: "left", fontSize: '120%', marginLeft: "1%", color: "grey"}}> {this.props.type}</b>
                        </div>

                        <div style={{justifyContent: "space-between", display: "flex", fontSize: '2vh'}}>
                            <b style={{textAlign: "left", fontSize: '120%', marginLeft: "1%", color: "grey"}}>{this.props.address}</b>
                        </div>

                        <div style={{justifyContent: "space-between", display: "flex", fontSize: '2vh'}}>
                            <b style={{textAlign: "left", fontSize: '120%', marginLeft: "1%", color: "grey"}}>{this.props.name}</b>
                        </div>

                        <div style={{justifyContent: "space-between", display: "flex", fontSize: '2vh'}}>
                            <b style={{textAlign: "left", fontSize: '120%', marginLeft: "1%", color: "grey"}}>{this.props.email}</b>
                        </div>

                        {this.props.reserved !== "None" && (
                            <div style={{justifyContent: "space-between", display: "flex", fontSize: '2vh'}}>
                            <b style={{textAlign: "left", fontSize: '120%', marginLeft: "1%", color: "red"}}>{this.props.reserved}</b>
                        </div>)}

                        <div style={{justifyContent: "space-between", display: "flex", fontSize: '2vh'}}>

                            <Box bgcolor="white" p={1} border={2} marginRight={0} marginLeft={10} marginBottom = {10} marginTop = {5} color = "#3792cd" style={{textAlign: "center", maxHeight: "7vh", borderRadius: "30%"}}>
                                <b style={{color:"black", fontSize: "120%"}}>Rent</b>
                                <br/>
                                <b style={{textAlign: "left", fontSize: '120%', marginLeft: "5%", color: "black"}}>{"$"}{this.props.rent}</b>
                            </Box>

                            <Box bgcolor="white" p={1} border={2} marginRight={0} marginLeft={5} marginBottom = {10} marginTop = {5} color = "#3792cd" style={{textAlign: "center", maxHeight: "7vh", borderRadius: "30%"}}>
                                <b style={{color:"black", fontSize: "120%"}}>Rooms</b>
                                <br/>
                                <b style={{fontSize: '120%', marginLeft: "5%", color: "black"}}>{this.props.rooms}</b>
                            </Box>

                            <Box bgcolor="white" p={1} border={2} marginRight={0} marginLeft={5} marginBottom = {10} marginTop = {5} color = "#3792cd" style={{textAlign: "center", maxHeight: "7vh", borderRadius: "30%"}}>
                                <b style={{color:"black", fontSize: "120%"}}>Bathrooms</b>
                                <br/>
                                <b style={{textAlign: "left", fontSize: '120%', marginLeft: "5%", color: "black"}}>{this.props.bathrooms}</b>
                            </Box>

                            {/* <Stack {...columnProps}>
                            <p><b>Address:</b> {this.props.address} </p>
                            <p><b>Contact Name:</b> {this.props.name}</p>
                            <p><b>Contact Information:</b> {this.props.email}  </p>
                            <p><b>Rent:</b> {this.props.rent}  </p>
                            <p><b>Number Of Rooms:</b> {this.props.rooms}  </p>
                            <p><b>Number Of Bathrooms:</b> {this.props.bathrooms}  </p>
                        </Stack> */}
                            <img src={this.props.image} alt="Nothing" style={{width: '24%', height: '19%', boxShadow: '1px 12px 9px #6f6f6f', borderRadius: '6%'}} />
                        </div>
                        <PrimaryButton text="More Info" onClick={this.setToTrue} style={{width: '16vh', marginLeft: "45%"}} allowDisabledFocus/>
                        <Modal
                            isOpen={this.state.extend}
                            onDismiss={this.setToTrue}
                            containerClassName={contentStyles.container}
                            isBlocking={false}
                            dragOptions={true}>

                            <div className={contentStyles.header}>
                                <span>{this.props.description}</span>
                                <IconButton
                                    styles={iconButtonStyles}
                                    iconProps={cancelIcon}
                                    ariaLabel="Close popup modal"
                                    onClick={this.setToTrue}
                                />
                            </div>
                            <div className={contentStyles.body}>
                                <Stack {...columnProps4}>
                                    <p><b>Address:</b> {this.props.address} </p>
                                    <p><b>Type of Listing: </b> {this.props.type}</p>
                                    <p><b>Contact Name:</b> {this.props.name}</p>
                                    <p><b>Contact Information:</b> {this.props.email}  </p>
                                    <p><b>Rent:</b> {this.props.rent}  </p>
                                    <p><b>Number Of Rooms:</b> {this.props.rooms}  </p>
                                    <p><b>Number Of Bathrooms:</b> {this.props.bathrooms}  </p>
                                    {this.props.reserved !== "None" && (<p><b>Reserved by: </b> {this.props.reserved}</p>)}
                                </Stack>
                                <img src={this.props.image} alt="Nothing" style={{width: '30%', height: '25%', boxShadow: '1px 12px 9px #6f6f6f', borderRadius: '6%'}} />
                            </div>
                            <div className={contentStyles.body}>
                                <Stack>
                                    <b>Description: </b>
                                    <p style={{textAlign: "justify"}}>{this.props.details}</p>
                                </Stack>
                            </div>
                            <Stack horizontal {...columnProps}>
                                <PrimaryButton text="Edit" onClick={this.openEditModal} style={{width: '16vh', marginLeft: "45%"}} disabled={this.props.userNow[0].email.toLowerCase() !== this.props.email.toLowerCase()}  allowDisabledFocus/>
                                <PrimaryButton text="Delete" onClick={this.openDeleteModal} style={{width: '16vh'}} disabled={this.props.userNow[0].email.toLowerCase() !== this.props.email.toLowerCase()} allowDisabledFocus/>
                            </Stack>
                            <Modal
                                isOpen={this.state.editModalOpen}
                                onDismiss={this.openEditModal}
                                containerClassName={contentStyles.container}
                                isBlocking={false}
                                dragOptions={true}>
                                <div className={contentStyles.header}>
                                    <span>Edit This Listing</span>
                                    <IconButton
                                        styles={iconButtonStyles}
                                        iconProps={cancelIcon}
                                        ariaLabel="Close popup modal"
                                        onClick={this.openEditModal}
                                    />
                                </div>
                                {/*<h1 style={{textAlign: "center"}}>Edit This Listing</h1>*/}
                                <div style={{display: "flex", justifyContent: "space-evenly", marginLeft: "4%", marginRight: "4%", marginTop: "2%"}}>
                                    <Stack {...columnProps}>
                                        <TextField placeholder={this.props.description} label="Name of Listing" autoAdjustHeight id={"descriptionsBox"}/>
                                        <TextField placeholder={this.props.name} label="Name " id={"namesBox"}/>
                                        <TextField placeholder={this.props.address} label="Listing Address"  id={"addresssBox"}/>
                                        <TextField placeholder={this.props.rooms} label="Number Of Rooms" id={"roomsBox"} onGetErrorMessage={value => {
                                            if(value !== "" && isNaN(Number(value)))
                                            {
                                                return "Please enter as a number"
                                            }
                                            else if (value.includes(","))
                                            {
                                                return "Enter the number without any commas"
                                            }
                                        }}/>
                                    </Stack>
                                    <Stack {...columnProps}>
                                        <TextField placeholder={this.props.rent} label="Rent" id={"rentsBox"} onGetErrorMessage={value => {
                                            if( value !== "" && isNaN(Number(value)))
                                            {
                                                return "Please enter as a number"
                                            }
                                            else if (value.includes(","))
                                            {
                                                return "Enter the number without any commas"
                                            }
                                        }}/>
                                        <TextField placeholder={this.props.details} label="Short Paragraph for Details" autoAdjustHeight id={"detailsBox"}/>
                                        <TextField placeholder={this.props.bathrooms} label="Number Of Bathrooms" id={"bathroomsBox"} onGetErrorMessage={value => {
                                            if(value !== "" && isNaN(Number(value)))
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
                                </div>
                                {/*<div>*/}
                                {/*<PrimaryButton onClick={this.handleOpen.bind(this)}>*/}
                                {/*    Add Image*/}
                                {/*</PrimaryButton>*/}
                                {/*<DropzoneDialog*/}
                                {/*    open={this.state.open}*/}
                                {/*    onSave={this.handleSave.bind(this)}*/}
                                {/*    acceptedFiles={['image/jpeg', 'image/png', 'image/bmp']}*/}
                                {/*    showPreviews={true}*/}
                                {/*    maxFileSize={5000000}*/}
                                {/*    onClose={this.handleClose.bind(this)}*/}
                                {/*/>*/}
                                {/*</div>*/}
                                <Stack horizontal {...columnProps2}>
                                    <DefaultButton text="Cancel" onClick={this.openEditModal}/>
                                    <PrimaryButton text="Confirm" onClick={this.editListing} style={{width: '16vh'}} allowDisabledFocus/>
                                </Stack>
                            </Modal>


                            <Modal
                                isOpen={this.state.deleteModalOpen}
                                onDismiss={this.openDeleteModal}
                                containerClassName={contentStyles.container}
                                isBlocking={false}
                                dragOptions={true}>

                                <div className={contentStyles.header}>
                                    <span>Delete This Listing</span>
                                    <IconButton
                                        styles={iconButtonStyles}
                                        iconProps={cancelIcon}
                                        ariaLabel="Close popup modal"
                                        onClick={this.openDeleteModal}
                                    />
                                </div>
                                <div className={contentStyles.body}>
                                    <h3> Are you sure you want to delete this listing?</h3>
                                </div>
                                <Stack horizontal {...columnProps3}>
                                    <DefaultButton text="Cancel" onClick={this.openDeleteModal}/>
                                    <PrimaryButton text="Delete" onClick={this.deleteListing} style={{width: '16vh'}} allowDisabledFocus/>
                                </Stack>
                            </Modal>
                        </Modal>
                    </Box>
                </>)}
                {!this.state.matches && (
                    <>
                        <Box bgcolor="white" p={1} border={2} marginRight={2} marginLeft={2}>
                            <b style={{textAlign: "center", fontSize: '110%', marginLeft: "1%"}}>{this.props.description}</b>

                            <div style={{justifyContent: "space-between", display: "flex", fontSize: '2vh'}}>
                                <b style={{textAlign: "left", fontSize: '90%', marginLeft: "1%", color: "grey"}}> {this.props.type}</b>
                            </div>

                            <div style={{justifyContent: "space-between", display: "flex", fontSize: '2vh'}}>
                                <b style={{textAlign: "left", fontSize: '90%', marginLeft: "1%", color: "grey"}}>{this.props.address}</b>
                            </div>

                            <div style={{justifyContent: "space-between", display: "flex", fontSize: '2vh'}}>
                                <b style={{textAlign: "left", fontSize: '90%', marginLeft: "1%", color: "grey"}}>{this.props.name}</b>
                            </div>

                            <div style={{justifyContent: "space-between", display: "flex", fontSize: '2vh'}}>
                                <b style={{textAlign: "left", fontSize: '90%', marginLeft: "1%", color: "grey"}}>{this.props.email}</b>
                            </div>

                            {this.props.reserved !== "None" && (
                                <div style={{justifyContent: "space-between", display: "flex", fontSize: '2vh'}}>
                                    <b style={{textAlign: "left", fontSize: '90%', marginLeft: "1%", color: "red"}}>{this.props.reserved}</b>
                                </div>)}

                            <br/>
                            <div style={{justifyContent: "space-between", display: "flex"}}>
                                <p>


                                </p>
                                <img src={this.props.image} alt="Nothing" style={{width: '50%', height: '40%', boxShadow: '1px 12px 9px #6f6f6f', borderRadius: '6%'}} />
                            </div>

                            <div style={{justifyContent: "space-between", display: "flex", fontSize: '2vh'}}>


                                <Box bgcolor="white" p={1} border={2} marginRight={0} marginBottom = {10} marginTop = {5} color = "#3792cd" style={{textAlign: "center", maxHeight: "7vh", borderRadius: "30%"}}>
                                    <b style={{color:"black", fontSize: "90%"}}>Rent</b>
                                    <br/>
                                    <b style={{textAlign: "left", fontSize: '90%', marginLeft: "5%", color: "black"}}>{"$"}{this.props.rent}</b>
                                </Box>

                                <Box bgcolor="white" p={1} border={2} marginRight={0} marginLeft={2} marginBottom = {10} marginTop = {5} color = "#3792cd" style={{textAlign: "center", maxHeight: "7vh", borderRadius: "30%"}}>
                                    <b style={{color:"black", fontSize: "90%"}}>Rooms</b>
                                    <br/>
                                    <b style={{fontSize: '100%', marginLeft: "5%", color: "black"}}>{this.props.rooms}</b>
                                </Box>

                                <Box bgcolor="white" p={1} border={2} marginRight={0} marginLeft={2} marginBottom = {10} marginTop = {5} color = "#3792cd" style={{textAlign: "center", maxHeight: "7vh", borderRadius: "30%"}}>
                                    <b style={{color:"black", fontSize: "90%"}}>Bathrooms</b>
                                    <br/>
                                    <b style={{textAlign: "left", fontSize: '90%', marginLeft: "5%", color: "black"}}>{this.props.bathrooms}</b>
                                </Box>

                            {/* <Stack {...columnProps}>
                            <p><b>Address:</b> {this.props.address} </p>
                            <p><b>Contact Name:</b> {this.props.name}</p>
                            <p><b>Contact Information:</b> {this.props.email}  </p>
                            <p><b>Rent:</b> {this.props.rent}  </p>
                            <p><b>Number Of Rooms:</b> {this.props.rooms}  </p>
                            <p><b>Number Of Bathrooms:</b> {this.props.bathrooms}  </p>
                        </Stack> */}
                            {/*<img src={this.props.image} alt="Nothing" style={{width: '24%', height: '19%', boxShadow: '1px 12px 9px #6f6f6f', borderRadius: '6%'}} />*/}
                        </div>
                        <PrimaryButton text="More Info" onClick={this.setToTrue} style={{width: '16vh', marginLeft: "35%"}} allowDisabledFocus/>
                        <Modal
                            isOpen={this.state.extend}
                            onDismiss={this.setToTrue}
                            containerClassName={contentStyles.container}
                            isBlocking={false}
                            dragOptions={true}>

                            <div className={contentStyles.header}>
                                <span>{this.props.description}</span>
                                <IconButton
                                    styles={iconButtonStyles}
                                    iconProps={cancelIcon}
                                    ariaLabel="Close popup modal"
                                    onClick={this.setToTrue}
                                />
                            </div>
                            <div className={contentStyles.body}>
                                <Stack {...columnProps4}>
                                    <p><b>Address:</b> {this.props.address} </p>
                                    <p><b>Type of Listing: </b> {this.props.type}</p>
                                    <p><b>Contact Name:</b> {this.props.name}</p>
                                    <p><b>Contact Information:</b> {this.props.email}  </p>
                                    <p><b>Rent:</b> {this.props.rent}  </p>
                                    <p><b>Number Of Rooms:</b> {this.props.rooms}  </p>
                                    <p><b>Number Of Bathrooms:</b> {this.props.bathrooms}  </p>
                                    <p><b>Reserved by: </b> {this.props.reservedBy === "" ? "None" : this.props.reserved}</p>
                                </Stack>
                                <img src={this.props.image} alt="Nothing" style={{width: '30%', height: '25%', boxShadow: '1px 12px 9px #6f6f6f', borderRadius: '6%'}} />
                            </div>
                            <div className={contentStyles.body}>
                                <Stack>
                                    <b>Description: </b>
                                    <p style={{textAlign: "justify"}}>{this.props.details}</p>
                                </Stack>
                            </div>
                            <Stack horizontal {...columnProps}>
                                <PrimaryButton text="Edit" onClick={this.openEditModal} style={{width: '16vh', marginLeft: "45%"}} disabled={this.props.userNow[0].email.toLowerCase() !== this.props.email.toLowerCase()}  allowDisabledFocus/>
                                <PrimaryButton text="Delete" onClick={this.openDeleteModal} style={{width: '16vh'}} disabled={this.props.userNow[0].email.toLowerCase() !== this.props.email.toLowerCase()} allowDisabledFocus/>
                            </Stack>
                            <Modal
                                isOpen={this.state.editModalOpen}
                                onDismiss={this.openEditModal}
                                containerClassName={contentStyles.container}
                                isBlocking={false}
                                dragOptions={true}>
                                <div className={contentStyles.header}>
                                    <span>Edit This Listing</span>
                                    <IconButton
                                        styles={iconButtonStyles}
                                        iconProps={cancelIcon}
                                        ariaLabel="Close popup modal"
                                        onClick={this.openEditModal}
                                    />
                                </div>
                                {/*<h1 style={{textAlign: "center"}}>Edit This Listing</h1>*/}
                                <div style={{display: "flex", justifyContent: "space-evenly", marginLeft: "4%", marginRight: "4%", marginTop: "2%"}}>
                                    <Stack {...columnProps}>
                                        <TextField placeholder={this.props.description} label="Name of Listing" autoAdjustHeight id={"descriptionsBox"}/>
                                        <TextField placeholder={this.props.name} label="Name " id={"namesBox"}/>
                                        <TextField placeholder={this.props.address} label="Listing Address"  id={"addresssBox"}/>
                                        <TextField placeholder={this.props.rooms} label="Number Of Rooms" id={"roomsBox"} onGetErrorMessage={value => {
                                            if(value !== "" && isNaN(Number(value)))
                                            {
                                                return "Please enter as a number"
                                            }
                                            else if (value.includes(","))
                                            {
                                                return "Enter the number without any commas"
                                            }
                                        }}/>

                                        <TextField placeholder={this.props.rent} label="Rent" id={"rentsBox"} onGetErrorMessage={value => {
                                            if( value !== "" && isNaN(Number(value)))
                                            {
                                                return "Please enter as a number"
                                            }
                                            else if (value.includes(","))
                                            {
                                                return "Enter the number without any commas"
                                            }
                                        }}/>
                                        <TextField placeholder={this.props.details} label="Short Paragraph for Details" autoAdjustHeight id={"detailsBox"}/>
                                        <TextField placeholder={this.props.bathrooms} label="Number Of Bathrooms" id={"bathroomsBox"} onGetErrorMessage={value => {
                                            if(value !== "" && isNaN(Number(value)))
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
                                </div>
                                {/*<div>*/}
                                {/*<PrimaryButton onClick={this.handleOpen.bind(this)}>*/}
                                {/*    Add Image*/}
                                {/*</PrimaryButton>*/}
                                {/*<DropzoneDialog*/}
                                {/*    open={this.state.open}*/}
                                {/*    onSave={this.handleSave.bind(this)}*/}
                                {/*    acceptedFiles={['image/jpeg', 'image/png', 'image/bmp']}*/}
                                {/*    showPreviews={true}*/}
                                {/*    maxFileSize={5000000}*/}
                                {/*    onClose={this.handleClose.bind(this)}*/}
                                {/*/>*/}
                                {/*</div>*/}
                                <Stack horizontal {...columnProps2}>
                                    <DefaultButton text="Cancel" onClick={this.openEditModal}/>
                                    <PrimaryButton text="Confirm" onClick={this.editListing} style={{width: '16vh'}} allowDisabledFocus/>
                                </Stack>
                            </Modal>


                            <Modal
                                isOpen={this.state.deleteModalOpen}
                                onDismiss={this.openDeleteModal}
                                containerClassName={contentStyles.container}
                                isBlocking={false}
                                dragOptions={true}>

                                <div className={contentStyles.header}>
                                    <span>Delete This Listing</span>
                                    <IconButton
                                        styles={iconButtonStyles}
                                        iconProps={cancelIcon}
                                        ariaLabel="Close popup modal"
                                        onClick={this.openDeleteModal}
                                    />
                                </div>
                                <div className={contentStyles.body}>
                                    <h3> Are you sure you want to delete this listing?</h3>
                                </div>
                                <Stack horizontal {...columnProps3}>
                                    <DefaultButton text="Cancel" onClick={this.openDeleteModal}/>
                                    <PrimaryButton text="Delete" onClick={this.deleteListing} style={{width: '16vh'}} allowDisabledFocus/>
                                </Stack>
                            </Modal>
                        </Modal>
                    </Box>
                </>)}
            </>
        );
    }

}

export default SingleList2;