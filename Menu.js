import React, { Component } from 'react';
import { Text, View, AsyncStorage, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { List, ListItem, Button } from 'react-native-elements';
import { NavigationActions, StackNavigator } from 'react-navigation';

import Loading from './Loading';

const db = require('./data.json');

export default class Menu extends Component {

    constructor(props) {
        super(props);
        
        this.state = {
            keys: [],
            updated: false,
            isNavigating: false
        }
    }
    
    static navigationOptions = ( {navigation} ) => ({
        title: 'Меню',
        headerLeft: (
            <Button 
                textStyle={{ fontSize: 18, color: '#1E90FF' }} 
                backgroundColor='rgba(255, 255, 255, 0)' 
                title='Выход' 
                buttonStyle={{ padding: 0 }}
                onPress={() => {
                    AsyncStorage.clear((err) => {
                        dropReset = NavigationActions.reset({
                            index: 0,
                            actions: [
                                NavigationActions.navigate({routeName: 'Loading', params: { username: null, password: null }})
                            ]
                        });
                        navigation.dispatch(dropReset);
                    });
            }}/>
        )
    });

    proceedToContent = (item) => {
        if (!this.state.isNavigating) {
            this.state.isNavigating = true;
            this.props.navigation.navigate('ContentMenu', {
                text: item.text,
                key: item.key,
            });
            setTimeout(this.toggleNavigation.bind(this), 700);
        }
    } 

    proceedToReport = () => {
        if (!this.state.isNavigating) {
            this.state.isNavigating = true;
            this.props.navigation.navigate('Report');
            setTimeout(this.toggleNavigation.bind(this), 700);
        }
    } 

    toggleNavigation() {
        this.state.isNavigating = false;
    } 

    updateStorage() {
        AsyncStorage.getAllKeys((err, keys) => {
            let allKeys = []
            keys.map((v, i) => {
                if ('0123456789'.includes(v[0]) && !allKeys.includes(parseInt(v[0]))) {
                    AsyncStorage.getItem(v, (err, res) => {
                        if (res.includes('t')) {
                            allKeys.push(parseInt(v[0]));
                            //console.log("ADDED ONE (MENU)");  
                        }
                    });
                }
            })
            setTimeout(() => {
                //console.log("ALLKEYS (MENU): " + allKeys);
                if (this.state.keys !== allKeys)
                    this.setState({keys: allKeys});
                AsyncStorage.setItem('updated_0', 'true');
                console.log('Updated_0');
            }, 100);
        })
    }

    rows = []
    _mounted = false;

    componentWillMount() {
        let {params} = this.props.navigation.state;
        for (let i = 0; i < db.ROOMS.length; i++) {
            this.rows.push({key: i, text: db.ROOMS[i].NAME});
        }
    }

    componentDidMount() {
        this._mounted = true;
        this.updateStorage();
        setInterval(() => {
            AsyncStorage.getItem('updated_0', (err, res) => {
                if(res == 'false' && this._mounted) this.updateStorage();
            });
        }, 1000);
    }

    componentWillUnmount() {
        this._mounted = false;
    }

    render() {
        return (            
            <View style={styles.container}>
                <FlatList 
                    data={this.rows}
                    extraData={this.state}
                    renderItem={({item}) => {
                        let message = ['Нет нарушений', 'Выявлены нарушения'];
                        let color = ['#8AC74A', '#FF5722'];
                        let err = 0;
                        if (this.state.keys.includes(item.key))
                            err = 1;
                        return (<ListItem
                            title={item.text}
                            titleStyle={{ fontSize: 18 }}
                            subtitle={message[err]}
                            subtitleStyle={{ color: color[err] }}
                            onPress={() => this.proceedToContent(item)}
                        />)
                    }}
                />
                {/*<Button title='ОТПРАВИТЬ' buttonStyle={{ width: '100%', 
                height: 56, backgroundColor: '#1E90FF' }}/>*/}
                <TouchableOpacity style={{ backgroundColor: '#2096F3', height: 56, alignItems: 'center', justifyContent: 'center' }}
                                  onPress={this.proceedToReport}>
                    <Text style={{ fontSize: 18, color: 'white' }}>ЗАКОНЧИТЬ</Text>
                </TouchableOpacity>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: { 
        flex: 1,
        backgroundColor: '#FFF',
    },
    listItem: {
        padding: 12,
        paddingLeft: 16,
        fontSize: 18,
        borderWidth: 1,
        borderColor: '#000',
        justifyContent: 'center'
    },
    subtitle: {
        //color: '#00BB00'
        color: '#BB0000'
    },
});