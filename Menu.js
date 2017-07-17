import React, { Component } from 'react';
import { Text, View, AsyncStorage, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { List, ListItem, Button } from 'react-native-elements';
import { NavigationActions, StackNavigator } from 'react-navigation';

import Loading from './Loading';

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
            this.props.navigation.navigate('Content', {
                text: item.text,
                key: item.key,
            });
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
                            console.log("ADDED ONE");  
                        }
                    });
                }
            })
            setTimeout(() => {
                console.log(allKeys);
                if (this.state.keys !== allKeys)
                    this.setState({keys: allKeys});
                AsyncStorage.setItem('updated', 'true');
                console.log('Updated');
            }, 200);
        })
    }

    componentDidMount() {
        this.updateStorage();
        setInterval(() => {
            AsyncStorage.getItem('updated', (err, res) => {
                if(res == 'false') this.updateStorage();
            });
        }, 1000);
    }

    render() {
        let params = {key: null};
        if (this.props.navigation.state.params !== undefined)
            params = this.props.navigation.state.params;
        if (params.key)
            if (!this.state.keys.includes(params.key))
                this.setState({keys: this.state.keys.push(params.key)});
        return (            
            <View style={styles.container}>
                <FlatList 
                    data={rows}
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
                <TouchableOpacity style={{ backgroundColor: '#2096F3', height: 56, alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={{ fontSize: 18, color: 'white' }}>ЗАКОНЧИТЬ</Text>
                </TouchableOpacity>
            </View>
        )
    }
}

const rows = [
    {key: 0, text: 'ПФБ'},
    {key: 1, text: 'Насосный блок'},
    {key: 2, text: 'Ёмкостной блок'},
    {key: 3, text: 'Блок ЦСГО'},
    {key: 4, text: 'Вышко-лебёдочный блок'},
    {key: 5, text: 'Кустовая площадка'},
]

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