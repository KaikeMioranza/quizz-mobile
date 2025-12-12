import * as react from 'react';
import {Appbar} from 'react-native-paper'

const myAppBar = () => (
    <Appbar.Header>
        <Appbar.BackAction onPress={()=>{}}/>
        <Appbar.Content title="Title"/>
    </Appbar.Header>
)

export default myAppBar;