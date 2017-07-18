import React, { Component } from 'react';
import { Text, View, AsyncStorage, FlatList, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Button, CheckBox } from 'react-native-elements';

const db = require('./data.json');

export default class Content extends Component {
    
    state = {
        items: [],
        checks: []
    }

    static navigationOptions = ({navigation}) => ({
        title: db.ROOMS[0].PROBLEMS[0].TITLE,
    })

    // Makes the menu re-render
    needUpdate = () => {
        AsyncStorage.setItem('updated', 'false');
    }


    // DATA ARRAY FOR THE FLATLIST
    sect = []

    componentWillMount() {
        // params.key - room key; params.prkey - problem key
        // TODO: Define prkey in the previous room (fucking important)
        // Gonna use 0 for debug purposes
        let {params} = this.props.navigation.state;
        let roomData = db.ROOMS[0] //[params.key];
        let problemData = roomData.PROBLEMS[0] //[params.prkey]
        let pr = [];
        // UNCOMMENT WHEN NOT DEBUGGING! \/ DOWN THERE!
        AsyncStorage.getItem(params.key + '_' + params.prkey, (err, res) => {
        //AsyncStorage.getItem('0_0', (err, res) => {
            for (let i = 0; i < problemData.INFO.length; i++) {
                //this.sect.push({key: i, title: problemData.TITLE, data: [problemData.INFO[i]] });
                this.sect.push({key: i, data: problemData.INFO[i] });
                if (res && !err)
                    pr[i] = res[i] === 't' ? true : false;
                else
                    pr[i] = false;
            }
            //console.log(this.sect);
            this.setState({checks: pr});
        });
        
    }

    render() {
        let bg = require('./assets/bg/bg.png');
        //setTimeout(() => { console.log(db.ROOMS[0].TITLE[0]); console.log(db.ROOMS[0].INFO[0]); }, 3000);
        let {params} = this.props.navigation.state;
        // let roomData = db.ROOMS[params.key];
        // let sect = [];
        // let pr = [[], [], []];
        // for (let i = 0; i <= roomData.TITLE.length-1; i++) {
        //     sect.push({key: i, title: roomData.TITLE[i], data: [roomData.INFO[i]] });
        //     pr[params.key][i] = false;
        // }
        
        //this.setState({checks: pr});
        //console.log(sect);
        return (
            <Image source={bg} style={{ alignSelf: 'stretch', flex: 1 }}>
                <FlatList
                    data={this.sect} 
                    extraData={this.state}
                    renderItem={({item}) => {
                        return (
                            <View style={{ flex: 1, marginHorizontal: 10, backgroundColor: "rgba(255, 255, 255, 0.8)", borderRadius: 10,
                                           marginVertical: 8 }}>
                            <Text style={styles.item}>{item.data}</Text>
                            <CheckBox
                                checkedColor="#FF5722"
                                containerStyle={{ marginLeft: 2, width: '100%', backgroundColor: "rgba(255, 255, 255, 0)", borderWidth: 0 }}
                                title="Нет"
                                checked={this.state.checks[item.key]}
                                onIconPress={() => {
                                    let pr = this.state.checks;
                                    pr[item.key] = !pr[item.key]
                                    this.setState(() => {return({checks: pr})});
                                }}
                                onPress={() => {
                                    let pr = this.state.checks;
                                    pr[item.key] = !pr[item.key]
                                    this.setState(() => {return({checks: pr})});
                                }}
                            />
                            </View>
                        )
                    }}
                />
                <TouchableOpacity style={{ backgroundColor: '#8AC74A', height: 56, alignItems: 'center', justifyContent: 'center' }} onPress={this.saveChecks}>
                    <Text style={{ fontSize: 18, color: 'white' }}>СОХРАНИТЬ И ВЫЙТИ</Text>
                </TouchableOpacity> 
            </Image>
        )
    }

    saveChecks = () => {
        let {params} = this.props.navigation.state;
        let info = '';
        let {checks} = this.state;
        checks.forEach((value) => {
            let ch = value ? 't' : 'f';
            info += ch;
        })
        // UNCOMMENT WHEN NOT DEBUGGING \/ DOWN THERE
        //AsyncStorage.setItem(params.key + '_' + params.prkey, info);
        AsyncStorage.setItem('0_0', info);
        this.needUpdate();
        console.log(info);

        //this.props.navigation.goBack();
    }
}

const styles = StyleSheet.create({
    sectionHeader: {
        paddingTop: 2,
        paddingLeft: 10,
        paddingRight: 10,
        paddingBottom: 2,
        fontSize: 14,
        fontWeight: 'bold',
        backgroundColor: '#fff',
    },
    item: {
        margin: 12,
        fontSize: 14,
    },
})