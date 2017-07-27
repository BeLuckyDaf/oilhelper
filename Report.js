import React, { Component } from 'react';
import { View, Text, TouchableOpacity, FlatList, Alert, AsyncStorage, StyleSheet, ScrollView } from 'react-native';

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
            },
            sending: false
        }
    }

    data = []

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
            let sorted = keys.sort();
            let index = 0;
            let titlesSet = [];
            console.log(sorted);
            sorted.map((v, i) => {
                if ('0123456789'.includes(v[0]) && '0123456789'.includes(v[0])) {
                    let room = v[0];
                    let problem = v[2];
                    AsyncStorage.getItem(v, (err, res) => {
                        if (res.includes('t')) {
                            if (!titlesSet.includes(room)) {
                                titlesSet.push(room);
                                this.data.push({key: index, text: db.ROOMS[room].NAME, type: 1}); // 1 - TITLE
                                index++;
                            }
                            this.data.push({key: index, text: db.ROOMS[room].PROBLEMS[problem].TITLE, type: 2}); // 2 - SUBTITLE
                            index++;
                            for (let n = 0; n < v.length; n++)
                                if (res[n] === 't') {
                                    this.data.push({key: index, text: db.ROOMS[room].PROBLEMS[problem].INFO[n], type: 3}); // 3 - ITEM
                                    index++;
                                }
                        }
                    });
                }
            })
            //setTimeout(() => console.log(data), 2000);
        })
    }


    sendMail = (email) => {
        //console.log(JSON.stringify({body: this.data}));
        this.setState({sending: true});
        let d = new Date().toLocaleString();
        fetch('http://139.59.154.229:3000/mail', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: email,
                body: this.data,
                loc: this.state.loc,
                date: d
            })
        })
        .then((response) => response.json())
        .then((res) => {

            if (res.success === true) {
                Alert.alert('Отправлено', `Отчёт отправлен на ${email}`, [{text: 'Закрыть'}], { cancelable: false });
                this.setState({sending: false});
            } else {
                Alert.alert('Ошибка', 'Письмо не может быть отправлено, приносим извинения', [{text: 'Закрыть'}], { cancelable: false });
                this.setState({sending: false});
            }
        }).catch((reason) => {
            this.setState({sending: false});
        }).done();
    }

    render() {
        //let data = this.data.length > 0 ? this.data : [{key: 0, text: 'Нарушений нет', type: 0}];
        let colors = ['#27ae60', '#1abc9c', '#c0392b', '#e74c3c'];
        let aligns = ['center', 'center', 'center', 'left'];
        let weights = ['normal', 'bold', 'normal', 'normal'];
        //let colors = ['#000', '#16a085', '#27ae60', '#2ecc71']; 'rgba(52,152,219,1)'
        return (
            <View style={{ flex: 1, backgroundColor: '#27ae60' }}>
                <View style={{ backgroundColor: '#27ae60'}}>
                    <Text style={styles.infoBase}><Text style={styles.infoTitle}>Месторождение: </Text><Text style={styles.infoText}>{this.state.loc.mr}</Text></Text>
                    <Text style={styles.infoBase}><Text style={styles.infoTitle}>Кустовая площадка: </Text><Text style={styles.infoText}>{this.state.loc.kp}</Text></Text>
                    <Text style={styles.infoBase}><Text style={styles.infoTitle}>Тип буровой: </Text><Text style={styles.infoText}>{this.state.loc.tb}</Text></Text>
                    <Text style={styles.infoBase}><Text style={styles.infoTitle}>Буровой подрядчик: </Text><Text style={styles.infoText}>{this.state.loc.bp}</Text></Text>
                </View>
                <FlatList
                    overScrollMode={'never'}
                    bounces={false}
                    data={this.data}
                    extraData={this.state.changed}
                    renderItem={({item}) => { 
                        return (
                            <View style={{ backgroundColor: colors[item.type], padding: 8 }}>
                                <Text style={{ textAlign: aligns[item.type], fontSize: 14, fontWeight: weights[item.type] }}>{item.text}</Text>
                            </View>
                        )
                    }}
                />
                <TouchableOpacity style={{ backgroundColor: '#1abc9c', height: 56, alignItems: 'center', justifyContent: 'center', width: "100%" }} 
                                  onPress={() => this.sendMail(this.state.email)} disabled={this.state.sending}>
                                  
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
        //color: '#fff',
        fontSize: 12,
        marginHorizontal: 16,
    },
    infoTitle: {
        //color: '#fff',
        fontSize: 12,
        fontWeight: 'bold',
    },
    infoBase: {
        marginVertical: 3,
        marginHorizontal: 8
    }
});