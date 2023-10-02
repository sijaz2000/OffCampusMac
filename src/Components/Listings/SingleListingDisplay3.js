import React from 'react'
import Box from '@material-ui/core/Box';
import {IStackProps, Stack} from '@fluentui/react/lib/Stack';
import {PrimaryButton, IconButton, DefaultButton} from '@fluentui/react/lib/Button';
import {   Modal, IDragOptions, getTheme, mergeStyleSets, FontWeights,} from '@fluentui/react';
import {IButtonStyles} from "@fluentui/react";
import {IIconProps, initializeIcons} from "@fluentui/react";
import { getDatabase, ref, set, onValue, remove } from "firebase/database";
import {initializeApp} from "firebase/app";


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

const columnProps3: Partial<IStackProps> = {
    tokens: { childrenGap:20 },
    styles: { root: { width: "10vw", marginBottom: 10, marginLeft: "6vw"} },
};

const columnProps2: Partial<IStackProps> = {
    tokens: { childrenGap:20 },
    styles: { root: { width: "20vw", marginBottom: 10, marginLeft: "6vw"} },
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);


const columnProps: Partial<IStackProps> = {
    styles: { root: { maxWidth: "53vh" }, tokens: { childrenGap:15 } },
};

const columnPropsPhone: Partial<IStackProps> = {
    tokens: { childrenGap:15 },
    styles: { root: { width: "20vw", marginBottom: 10} },
};

const mailIcon: IIconProps = { iconName: 'Mail' };

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



class SingleList3 extends React.Component
{
    constructor(props) {
        super(props);
        this.state =
            {
                extend: false,
                modalOpen: false,
                matches: window.matchMedia("(min-width: 680px)").matches,
                modalOpenUnreserve: false
            }

    }

    componentDidMount() {
        const handler = e => this.setState({matches: e.matches});
        window.matchMedia("(min-width: 680px)").addEventListener('change', handler);
    }

    giveToUser = () =>
    {
        if(this.props.email !== this.props.userNow[0].email)
        {
            set(ref(database, 'items/' + this.props.address), {
                description: this.props.description,
                name: this.props.name,
                email: this.props.email,
                address: this.props.address,
                rent: this.props.rent,
                photo: this.props.image,
                details: this.props.details,
                numberRooms: this.props.rooms,
                numberBathrooms: this.props.bathrooms,
                listingType: this.props.type,
                reservedBy: this.props.userNow[0].email
            }).then(() =>
            {
                alert("You have successfully reserved this Listing and the owner has been contacted. Please refresh page to see changes")
                this.openDeleteModal();
            });
        }
        else
        {
            alert("Error: You cannot reserve your own listing")
        }
    }

    openDeleteModal = () =>
    {
        this.setState(prevState => ({modalOpen: !prevState.modalOpen}));
    }



    setToTrue = () =>
    {
        this.setState(prevState => ({extend: !prevState.extend}));
    }

    openReserveModal = () =>
    {
        this.setState(prevState => ({modalOpenUnreserve: !prevState.modalOpenUnreserve}));
    }

    Unreserve = () =>
    {

        set(ref(database, 'items/' + this.props.address), {
            description: this.props.description,
            name: this.props.name,
            email: this.props.email,
            address: this.props.address,
            rent: this.props.rent,
            photo: this.props.image,
            details: this.props.details,
            numberRooms: this.props.rooms,
            numberBathrooms: this.props.bathrooms,
            listingType: this.props.type,
            reservedBy: "None"
        }).then(() =>
        {
            alert("You have successfully unreserved this Listing. Please refresh page to see changes")
            this.openReserveModal();
        });
    }

    render()
    {
        return (
            <>
                {this.state.matches && (
                    <>
                        <Box bgcolor="white" p={1} border={2} marginRight={10} marginLeft={10}>
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
                                <img src={this.props.image} alt="Nothing" style={{width: '35%', height: '25%', boxShadow: '1px 12px 9px #6f6f6f', borderRadius: '6%'}} />
                            </div>
                            <Stack horizontal {...columnProps2}>
                                <PrimaryButton text="More Info" onClick={this.setToTrue} style={{width: '25vh', marginLeft: "47%", minWidth: "15vh"}} allowDisabledFocus/>
                                <PrimaryButton text="Unreserve" onClick={this.openReserveModal} style={{width: '25vh', marginLeft: "47%", minWidth: "15vh"}} allowDisabledFocus/>
                            </Stack>
                            <Modal
                                isOpen={this.state.modalOpenUnreserve}
                                onDismiss={this.openReserveModal}
                                containerClassName={contentStyles.container}
                                isBlocking={false}
                                dragOptions={true}>

                                <div className={contentStyles.header}>
                                    <span>Unreserve This Listing</span>
                                    <IconButton
                                        styles={iconButtonStyles}
                                        iconProps={cancelIcon}
                                        ariaLabel="Close popup modal"
                                        onClick={this.openReserveModal}
                                    />
                                </div>
                                <div className={contentStyles.body}>
                                    <h3> Confirm Action?</h3>
                                </div>
                                <Stack horizontal {...columnProps3}>
                                    <DefaultButton text="Cancel" onClick={this.openReserveModal}/>
                                    <PrimaryButton text="Confirm" onClick={this.Unreserve} style={{width: '16vh'}} allowDisabledFocus/>
                                </Stack>
                            </Modal>

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
                                    <Stack {...columnProps}>
                                        <p><b>Address:</b> {this.props.address} </p>
                                        <p><b>Type of Listing: </b> {this.props.type}</p>
                                        <p><b>Contact Name:</b> {this.props.name}</p>
                                        <p><b>Contact Information:</b> {this.props.email}  </p>
                                        <p><b>Rent:</b> {this.props.rent}  </p>
                                        <p><b>Number Of Rooms:</b> {this.props.rooms}  </p>
                                        <p><b>Number Of Bathrooms:</b> {this.props.bathrooms}  </p>
                                    </Stack>
                                    <img src={this.props.image} alt="Nothing" style={{width: '30%', height: '25%', boxShadow: '1px 12px 9px #6f6f6f', borderRadius: '6%'}} />
                                </div>
                                <div className={contentStyles.body}>
                                    <Stack>
                                        <b>Description: </b>
                                        <p style={{textAlign: "justify"}}>{this.props.details}</p>
                                    </Stack>

                                </div>


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
                                    <b style={{fontSize: '90%', marginLeft: "5%", color: "black"}}>{this.props.rooms}</b>
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
                            </div>
                            <Stack horizontal {...columnPropsPhone}>
                                <PrimaryButton text="More Info" onClick={this.setToTrue} style={{width: '25vh', marginLeft: "100%"}} allowDisabledFocus/>
                                <PrimaryButton text="Unreserve" onClick={this.openReserveModal} style={{width: '25vh', marginLeft: "13%"}} allowDisabledFocus/>
                            </Stack>
                            <Modal
                                isOpen={this.state.modalOpenUnreserve}
                                onDismiss={this.openReserveModal}
                                containerClassName={contentStyles.container}
                                isBlocking={false}
                                dragOptions={true}>

                                <div className={contentStyles.header}>
                                    <span>Unreserve This Listing</span>
                                    <IconButton
                                        styles={iconButtonStyles}
                                        iconProps={cancelIcon}
                                        ariaLabel="Close popup modal"
                                        onClick={this.openReserveModal}
                                    />
                                </div>
                                <div className={contentStyles.body}>
                                    <h3> Confirm Action?</h3>
                                </div>
                                <Stack horizontal {...columnProps3}>
                                    <DefaultButton text="Cancel" onClick={this.openReserveModal}/>
                                    <PrimaryButton text="Confirm" onClick={this.Unreserve} style={{width: '16vh'}} allowDisabledFocus/>
                                </Stack>
                            </Modal>

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
                                    <Stack {...columnProps}>
                                        <p><b>Address:</b> {this.props.address} </p>
                                        <p><b>Type of Listing: </b> {this.props.type}</p>
                                        <p><b>Contact Name:</b> {this.props.name}</p>
                                        <p><b>Contact Information:</b> {this.props.email}  </p>
                                        <p><b>Rent:</b> {this.props.rent}  </p>
                                        <p><b>Number Of Rooms:</b> {this.props.rooms}  </p>
                                        <p><b>Number Of Bathrooms:</b> {this.props.bathrooms}  </p>
                                    </Stack>
                                    <img src={this.props.image} alt="Nothing" style={{width: '30%', height: '25%', boxShadow: '1px 12px 9px #6f6f6f', borderRadius: '6%'}} />
                                </div>
                                <div className={contentStyles.body}>
                                    <Stack>
                                        <b>Description: </b>
                                        <p style={{textAlign: "justify"}}>{this.props.details}</p>
                                    </Stack>

                                </div>


                            </Modal>
                        </Box>
                    </>)}
            </>
        );
    }

}

export default SingleList3