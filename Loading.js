import React, { Component } from 'react';
import { Text, View, ActivityIndicator, AsyncStorage } from 'react-native';
import { NavigationActions } from 'react-navigation';

import Login from './Login';
import Menu from './Menu';

export default class Loading extends Component {

    static navigationOptions = {
        title: '',
    };

    state = {
            success: 0,
            username: '',
            error: 0,
            errorMessage: '',
    }

    dropback = (error, errorMessage) => {
        dropReset = NavigationActions.reset({
            index: 0,
            actions: [
                NavigationActions.navigate({routeName: 'Login', params: { error, errorMessage }})
            ]
        });
        
        this.props.navigation.dispatch(dropReset);
    }

    proceedToMenu = () => {
        proceedReset = NavigationActions.reset({
            index: 0,
            actions: [
                NavigationActions.navigate({routeName: 'Menu'})
            ]
        });

        this.props.navigation.dispatch(proceedReset);
    }

    proceedToLocSettings = (username) => {

        proceedReset = NavigationActions.reset({
            index: 0,
            actions: [
                NavigationActions.navigate({routeName: 'LocationSettings'})
            ]
        });

        //AsyncStorage.getAllKeys((err, keys) => console.log(keys));

        let keys = ['loc_mr', 'loc_kp', 'loc_tb', 'loc_bp']
        AsyncStorage.multiGet(keys, (errs, stores) => {
            console.log(stores);
            let notdone = false;
            for (let i = 0; i < keys.length; i++)
                if (stores[i][1] == null || stores[i][1] == "") {
                    notdone = true;
                    break;
                }
            if (errs)
                this.props.navigation.dispatch(proceedReset);
            else if (notdone)
                this.props.navigation.dispatch(proceedReset);
            else
                this.proceedToMenu();
        });

        
    }

    componentDidMount() {
        setTimeout(() => {
            let username, password = null;
            
            if (this.props.navigation.state.params !== undefined) {
                username = this.props.navigation.state.params.username;
                password = this.props.navigation.state.params.password;
            }

            if (username === null || password === null) {

                // DEBUG
                // AsyncStorage.removeItem('email', (err) => {
                //     this.dropback(1, 'Ошибка чтения');
                // });
                // ANOTHER DEBUG
                AsyncStorage.setItem('updated_0', 'true');

                AsyncStorage.getItem('email', (err, result) => {
                    if (err) this.dropback(1, 'Ошибка чтения');
                    if (result === null) this.dropback(0, "НЕТ ДАННЫХ")
                    else {
                        // GO TO THE MENU
                        //this.proceedToMenu(result);            
                        this.proceedToLocSettings();
                    }        
                });

            } else if (username === "" || password === "") {
                this.dropback(1, 'Ошибка входа: логин и пароль - обязательные для заполнения поля!');
            } else {
                // LOGGING IN
                fetch('http://139.59.154.229:3000/users', {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        username: username,
                        password: password,
                    })
                })
                .then((response) => response.json())
                .then((res) => {

                    if (res.success === true) {
                        var username = res.message;
                        AsyncStorage.setItem('email', username);
                        //this.proceedToMenu();
                        this.proceedToLocSettings();
                    } else {
                        this.dropback(1, 'Неправильный логин/пароль!');
                    }
                }).catch((reason) => {
                    this.dropback(1, 'Возможные причины сбоя:\nСервер не отвечает\nНет доступа к интернету');
                }).done();
            }
        }, 1500);
    }

    render() {
        return (
            <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}>
                <ActivityIndicator
                    animating={!this.state.success}
                    size='large'
                />
                {/*<Text style={{color: 'green', fontSize: 20, marginTop: 28, opacity: this.state.success}}>Выполнен вход: {this.state.uname}</Text>*/}
            </View>
        )
    }   
}