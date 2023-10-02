import React from 'react';
import Info from './Components/MainPage/Main_Page'
import Navbar from './Components/Navbar/Navbar';
import AboutUs from "./Components/About Us/AboutUs";
import Footnote from "./Components/Footnote/footnote";
import AddListings from "./Components/Listings/AddListing";
import './CSS/App.css';

class App extends React.Component
{
    constructor(props) {
        super(props);
        this.state=
        {
            done: false,
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
            <>
                {this.state.matches && (
                    <>
                    <Navbar />
                    <br/>
                    <br/>
                    <Info/>
                    <AddListings userNow={this.props.userNow}/>
                    <AboutUs/>
                    <Footnote/>
                </>)}

                {!this.state.matches && (
                    <>
                    <Navbar />
                    <br/>
                    <br/>
                    <Info/>
                    <AddListings userNow={this.props.userNow}/>
                    <Footnote/>
                </>)}

            </>
        );
    }
}

export default App;
