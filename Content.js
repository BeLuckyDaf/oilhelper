import React, { Component } from 'react';
import { Text, View, AsyncStorage, SectionList, StyleSheet, TouchableOpacity } from 'react-native';
import { Button, CheckBox } from 'react-native-elements';

const db = require('./data.json');

export default class Content extends Component {
    
    state = {
        items: [],
        checks: []
    }

    static navigationOptions = ({navigation}) => ({
        title: navigation.state.params.text,
    })

    // Makes the menu re-render
    needUpdate = () => {
        AsyncStorage.setItem('updated', 'false');
    }

    sect = []

    componentWillMount() {
        let {params} = this.props.navigation.state;
        let roomData = db.ROOMS[params.key];
        //let sect = [];
        let pr = this.state.checks;
        for (let i = 0; i <= roomData.TITLE.length-1; i++) {
            this.sect.push({key: i, title: roomData.TITLE[i], data: [roomData.INFO[i]] });
            pr[i] = false;
        }
        this.setState({checks: pr});
    }

    render() {
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
            <View style={{ flex: 1 }} backgroundColor="#fff">
                <SectionList 
                    sections={this.sect}
                    extraData={this.state}
                    keyExtractor={(item) => {}}
                    renderItem={({item, section}) => {
                        return (
                            <View style={{ flex: 1 }}>
                            <Text style={styles.item}>{item}</Text>
                            <CheckBox
                                containerStyle={{ marginLeft: 0, width: '100%', backgroundColor: "rgba(255, 255, 255, 0)" }}
                                title="Нет"
                                checked={this.state.checks[section.key]}
                                onIconPress={() => {
                                    let pr = this.state.checks;
                                    pr[section.key] = !pr[section.key]
                                    this.setState(() => {return({checks: pr})});
                                }}
                                onPress={() => {
                                    let pr = this.state.checks;
                                    pr[section.key] = !pr[section.key]
                                    this.setState(() => {return({checks: pr})});
                                }}
                            />
                            </View>
                        )
                    }}
                    renderSectionHeader={({section}) => {
                        return (
                            <Text style={styles.sectionHeader}>{section.title}</Text>
                        )
                    }}
                />
                <TouchableOpacity style={{ backgroundColor: '#8AC74A', height: 56, alignItems: 'center', justifyContent: 'center' }} onPress={this.saveChecks}>
                    <Text style={{ fontSize: 18, color: 'white' }}>СОХРАНИТЬ И ВЫЙТИ</Text>
                </TouchableOpacity> 
            </View>
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
        AsyncStorage.setItem(params.key + '_ROOM', info);
        this.needUpdate();
        console.log(info);

        this.props.navigation.goBack();
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
        padding: 10,
        fontSize: 12,
    },
})