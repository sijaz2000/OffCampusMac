import React from 'react';
import Scrollspy from 'react-scrollspy';
import '../../CSS/Navbar.css';
import image from "../../Resources/MacLogo.png";


class Navbar extends React.Component {
    constructor() {
        super();
        this.state=
        {
            matches: window.matchMedia("(min-width: 680px)").matches
        }
    }

    componentDidMount() {
        const handler = e => this.setState({matches: e.matches});
        window.matchMedia("(min-width: 680px)").addEventListener('change', handler);
    }

    render()
    {
        return (
            <nav className="desktop-navigation" style={{boxShadow: '1px 7px 9px #0f0f0f'}}>
                <div style={{display:'flex'}}>
                    {this.state.matches && (<img src={image}  alt="Nothing" style={{width: "60px", height: "60px"}}/>)}
                    {!this.state.matches && (<img src={image}  alt="Nothing" style={{display: "none"}}/>)}
                    {this.state.matches && (<h2>OffCampus@Mac</h2>)}
                    {/*{!this.state.matches && (<h2>OffCampus@Mac</h2>)}*/}
                </div>
                {this.state.matches && (
                    <>
                    <Scrollspy
                        items={['home', 'listings', 'addListing', 'profile', 'aboutus']}
                        currentClassName="active">
                        <li><a href="#home">Home</a></li>
                        <li><a href="#listings">Listings</a></li>
                        <li><a href="#addListing">Add Listing</a></li>
                        <li><a href="#profile">Profile</a></li>
                        <li><a href="#aboutus">About</a></li>
                    </Scrollspy>
                </>)}
                {!this.state.matches && (
                    <>
                    <Scrollspy
                        items={['home', 'listings', 'addListing', 'profile']}
                        currentClassName="active">
                        <li style={{marginLeft: "-15%", marginRight: "2%"}}><a href="#home">Home</a></li>
                        <li style={{marginRight: "3%"}}><a href="#listings">Listings</a></li>
                        <li style={{marginRight: "3%"}}><a href="#addListing">Add Listing</a></li>
                        <li style={{marginRight: "3%"}}><a href="#profile">Profile</a></li>
                    </Scrollspy>
                </>)}
            </nav>
        );

    }
}

export default Navbar;