import React from 'react'
import Box from '@material-ui/core/Box';
import {IStackProps, Stack} from '@fluentui/react/lib/Stack';
import { PrimaryButton } from '@fluentui/react/lib/Button';


class FullInfo extends React.Component {
    constructor(props)
    {
        super(props);
        this.state =
        {
            extend: true
        }
    }

    render()
    {
        return (
            <>
                <p>This was rendered</p>
            </>
        )
    }
}

export default FullInfo