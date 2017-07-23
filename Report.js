import React, { Component } from 'react';
import { View, Text, TouchableOpacity, SectionList, Alert, AsyncStorage, StyleSheet, ScrollView } from 'react-native';

const db = require('./data.json');

export default class Report extends Component {

    constructor(props) {
        super(props);

        this.state = {
            email: "",
            loc: {
                mr: '',
                kp: '',
                tb: '',
                bp: ''
            }
        }
    }

    problems = []

    componentWillMount() {
        AsyncStorage.getItem('email', (err, res) => {
            if (err) console.log(err);
            if (res) this.setState({email: res});
        });

        let keys = ['loc_mr', 'loc_kp', 'loc_tb', 'loc_bp']
        AsyncStorage.multiGet(keys, (errs, stores) => {
            this.setState({loc: {mr: stores[0][1], kp: stores[1][1], tb: stores[2][1], bp: stores[3][1]}});
        });

        AsyncStorage.getAllKeys((err, keys) => {
            let allKeys = []
            keys.map((v, i) => {
                if ('0123456789'.includes(v[0]) && !allKeys.includes(parseInt(v[0]))) {
                    AsyncStorage.getItem(v, (err, res) => {
                        if (res.includes('t')) {
                            allKeys.push(parseInt(v[0]));
                              
                        }
                    });
                }
            })
            
        })
    }

    sendMail = (email) => {
        
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={{ backgroundColor: 'rgba(52,152,219,0.2)', flex: 1, marginBottom: 24}}>
                    <Text style={styles.infoBase}><Text style={styles.infoTitle}>Месторождение: </Text><Text style={styles.infoText}>{this.state.loc.mr}</Text></Text>
                    <Text style={styles.infoBase}><Text style={styles.infoTitle}>Кустовая площадка: </Text><Text style={styles.infoText}>{this.state.loc.kp}</Text></Text>
                    <Text style={styles.infoBase}><Text style={styles.infoTitle}>Тип буровой: </Text><Text style={styles.infoText}>{this.state.loc.tb}</Text></Text>
                    <Text style={styles.infoBase}><Text style={styles.infoTitle}>Буровой подрядчик: </Text><Text style={styles.infoText}>{this.state.loc.bp}</Text></Text>
                </View>


                <TouchableOpacity style={{ backgroundColor: '#1abc9c', height: 56, alignItems: 'center', justifyContent: 'center', width: "100%" }} 
                                  onPress={this.sendMail(this.state.email)}>
                    <Text style={{ fontSize: 16, color: 'white', textAlign: 'center' }}>{`ОТПРАВИТЬ ОТЧЁТ НА\n${this.state.email.toUpperCase()}`}</Text>
                </TouchableOpacity>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff'
    },
    infoText: {
        fontSize: 16,
        marginHorizontal: 16,
    },
    infoTitle: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    infoBase: {
        marginVertical: 3,
        marginHorizontal: 8
    }
});