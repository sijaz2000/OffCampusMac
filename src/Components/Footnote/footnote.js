import '../../CSS/index.css'
import React from "react";

class Footnote extends React.Component
{
    render()
    {
        return (
            <>
                <div style={{position: 'relative'}}>
                    <div style={{textAlign: 'center',  paddingLeft: '10%',bottom: '35%',paddingRight: '10%'}}>
                        <p style={{fontSize: '20px', fontFamily: 'Newslab, georgia, Bakersville', color: '#000000'}}>&copy; 2022 Alahasa SP.</p>
                    </div>
                </div>
            </>
        );
    }
}

export default Footnote