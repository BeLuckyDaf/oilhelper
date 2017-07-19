import React, { Component } from 'react';
import { Text, View, AsyncStorage, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { List, ListItem, Button } from 'react-native-elements';
import { NavigationActions, StackNavigator } from 'react-navigation';

import Content from './Content';

const db = require('./data.json');

export default class ContentMenu extends Component {

    constructor(props) {
        super(props);
        
        this.state = {
            keys: [],
            updated: false,
            isNavigating: false
        }
    }
    
    static navigationOptions = ( {navigation} ) => ({
        title: navigation.state.params.text,
    });

    proceedToContent = (item) => {
        if (!this.state.isNavigating) {
            this.state.isNavigating = true;
            this.props.navigation.navigate('Content', {
                text: item.text,
                key: this.props.navigation.state.params.key,
                prkey: item.key,
            });
            setTimeout(this.toggleNavigation.bind(this), 700);
        }
    } 

    toggleNavigation() {
        this.state.isNavigating = false;
    } 

    updateStorage() {
        AsyncStorage.getAllKeys((err, keys) => {
            //console.log(keys + " (KEYS CONTENT MENU)");
            let {params} = this.props.navigation.state;
            //console.log(params.key + " (PARAMS.KEY CONTENT MENU)");
            let allKeys = []
            keys.map((v, i) => {
                if ('0123456789'.includes(v[2]) && !allKeys.includes(parseInt(v[2])) && v[0] == params.key) {
                    AsyncStorage.getItem(v, (err, res) => {
                        //console.log(res + "(CONTENT MENU)");
                        if (res.includes('t')) {
                            allKeys.push(parseInt(v[2]));
                            //console.log("ADDED ONE (CONTENT MENU)");  
                        }
                    });
                }
            })
            setTimeout(() => {
                //console.log(allKeys + " (ALL KEYS CONTENT MENU)");
                if (this.state.keys !== allKeys)
                    this.setState({keys: allKeys});
                AsyncStorage.setItem('updated_1', 'true');
                console.log('Updated_1');
            }, 100);
        })
    }
    
    rows = []
    _mounted = false;

    componentWillMount() {
        let {params} = this.props.navigation.state;
        for (let i = 0; i < db.ROOMS[params.key].PROBLEMS.length; i++) {
            this.rows.push({key: i, text: db.ROOMS[params.key].PROBLEMS[i].TITLE});
        }
    }

    componentWillUnmount() {
        this._mounted = false;
    }

    componentDidMount() {
        this.updateStorage();
        setInterval(() => {
            AsyncStorage.getItem('updated_1', (err, res) => {
                if(res == 'false' && this._mounted) this.updateStorage();
            });
        }, 200);
        this._mounted = true;
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
                            titleNumberOfLines={2}
                            title={item.text}
                            titleStyle={{ fontSize: 18 }}
                            subtitle={message[err]}
                            subtitleStyle={{ color: color[err] }}
                            onPress={() => this.proceedToContent(item)}
                        />)
                    }}
                />
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