import React, { Component } from 'react';
import { View, NavigatorIOS, Button } from 'react-native';
import { StackNavigator } from 'react-navigation';

import Login from './Login';
import Loading from './Loading';
import Menu from './Menu';
import Content from './Content';

class App extends Component {
    
    /*
        Basically, this is a router, but there are some issues,
        which I am too lazy to solve, so the application's entry
        point must be App.js.
    */

    render() {
        return (
            <View />
        )
    }
}

export default StackNavigator({
    Loading: {
        screen: Loading,
    },
    Login: {
        screen: Login,
    },
    Menu: {
        screen: Menu,
    },
    Content: {
        screen: Content, 
    },
});

Expo.registerRootComponent(App);
