import '../../CSS/index.css'
import * as React from 'react';
import { initializeApp } from "firebase/app";
import {getDatabase, onValue, ref} from "firebase/database";
import { getTheme, mergeStyleSets } from '@fluentui/react/lib/Styling';
import { ScrollablePane, IScrollablePaneStyles } from '@fluentui/react/lib/ScrollablePane';
import {PrimaryButton} from "@fluentui/react/lib/Button";

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

const theme = getTheme();

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export interface IScrollablePaneExampleItem {
    color: string;
    text: string;
    index: number;
}

const classNames = mergeStyleSets({
    wrapper: {
        height: '40vh',
        position: 'relative',
        maxHeight: 'inherit',
    },
    pane: {
        maxWidth: 1400,
        border: '1px solid ' + theme.palette.black
    },
    textContent: {
        padding: '15px 10px',
    },
});

const scrollablePaneStyles: Partial<IScrollablePaneStyles> = { root: classNames.pane };


class Listings extends React.Component{
    constructor(props)
    {
        super(props);
        this.state =
            {
                checked: true,
                listings: []
            }
    }

    readUserData = () =>
    {
        const starCountRef = ref(database, 'items');
        onValue(starCountRef, (snapshot) => {
            snapshot.forEach(function(childSnapshot)
            {
                this.state.listings.push(childSnapshot.val());
            })
        });
    }

    updateValue = () =>
    {
        this.setState(prevState => ({checked: !prevState.checked}));
    }

    render()
    {
        return (
            <>
                <div style={{position: 'relative'}}>
                    <div style={{textAlign: 'center',  paddingLeft: '10%',bottom: '35%',paddingRight: '10%'}}>
                        <section id={"listings"}>
                            <h1 style={{fontSize: '6vh', fontFamily: 'Newslab, georgia, Bakersville', color: '#000000'}}>Available Listings</h1>
                        </section>
                        <PrimaryButton text="Add Listing" onClick={this.readUserData} style={{marginLeft: "45%"}}  allowDisabledFocus />
                        <div className={classNames.wrapper}>
                            <ScrollablePane scrollContainerFocus={true} scrollContainerAriaLabel="Sticky component example" styles={scrollablePaneStyles}>
                                {this.state.listings}
                            </ScrollablePane>
                        </div>
                    </div>
                </div>
                <div className="separator" />
            </>
        );
    }

}

export default Listings;