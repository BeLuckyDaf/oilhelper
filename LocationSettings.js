import { Constants } from 'expo';
import React, { Component } from 'react';
import { Text, View, StyleSheet, TextInput, TouchableOpacity, KeyboardAvoidingView, ActivityIndicator, Image, AsyncStorage } from 'react-native';
import { NavigationActions } from 'react-navigation';

export default class LocationSettings extends Component {

    static navigationOptions = {
        title: 'Местонахождение'
    }

    state = {
        mr: "",
        kp: "",
        tb: "",
        bp: "",
    }

    _handleMrChange = mr => {
		this.setState({ mr });
    };
    _handleKpChange = kp => {
		this.setState({ kp });
    };
    _handleTbChange = tb => {
		this.setState({ tb });
    };
    _handleBpChange = bp => {
		this.setState({ bp });
	};

    render() {
        let bg = require('./assets/bg/bg.png');

        return (
            <Image source={bg} style={{ alignSelf: 'stretch', flex: 1 }}>
      			<KeyboardAvoidingView behavior='padding' style={styles.container}>
        			<TextInput
          				keyboardType='default'
						returnKeyType='done'
						autoCapitalize='none'
						autoCorrect={false}
						placeholder='Месторождение'
						placeholderTextColor='#ddd'
						value={this.state.mr}
						onChangeText={this._handleMrChange}
						style={{ marginHorizontal: 16, height: 44, paddingLeft: 16, borderRadius: 10, backgroundColor: 'rgba(0,0,0,0.4)', color: '#eee', marginBottom: 8, width: "80%" }}
                    />
                    <TextInput
          				keyboardType='default'
						returnKeyType='done'
						autoCapitalize='none'
						autoCorrect={false}
						placeholder='Кустовая площадка'
						placeholderTextColor='#ddd'
						value={this.state.kp}
						onChangeText={this._handleKpChange}
						style={{ marginHorizontal: 16, height: 44, paddingLeft: 16, borderRadius: 10, backgroundColor: 'rgba(0,0,0,0.4)', color: '#eee', marginBottom: 8, width: "80%" }}
                    />
                    <TextInput
          				keyboardType='default'
						returnKeyType='done'
						autoCapitalize='none'
						autoCorrect={false}
						placeholder='Тип буровой'
						placeholderTextColor='#ddd'
						value={this.state.tb}
						onChangeText={this._handleTbChange}
						style={{ marginHorizontal: 16, height: 44, paddingLeft: 16, borderRadius: 10, backgroundColor: 'rgba(0,0,0,0.4)', color: '#eee', marginBottom: 8, width: "80%" }}
                    />
                    <TextInput
          				keyboardType='default'
						returnKeyType='done'
						autoCapitalize='none'
						autoCorrect={false}
						placeholder='Буровой подрядчик'
						placeholderTextColor='#ddd'
						value={this.state.bp}
						onChangeText={this._handleBpChange}
						style={{ marginHorizontal: 16, height: 44, paddingLeft: 16, borderRadius: 10, backgroundColor: 'rgba(0,0,0,0.4)', color: '#eee', marginBottom: 8, width: "80%" }}
                    />
			
					<TouchableOpacity onPressOut={this._Continue} style={styles.buttonContainer}>
						<View style={styles.submitButton} >
							<Text style={styles.submitText}>ПРОДОЛЖИТЬ</Text>
						</View >
					</TouchableOpacity>
					<View style={{ height: 64 }} />
      			</KeyboardAvoidingView>
	  		</Image>
        )
    }

    _Continue = () => {
        let {mr, kp, tb, bp} = this.state;
        console.log(mr + ' MR');
        AsyncStorage.multiSet([['loc_mr', mr], ['loc_kp', kp], ['loc_tb', tb], ['loc_bp', bp]], (errs) => {
            this.props.navigation.dispatch(NavigationActions.reset({
			    index: 0,
			    actions: [
				    //NavigationActions.navigate({ routeName: 'Loading', params: { username: this.state.username, password: this.state.password } }),
				    NavigationActions.navigate({ routeName: 'Loading'}),
			    ]
		    }));
        });
    }
}

const styles = StyleSheet.create({
	container: {
    	flex: 1,
    	alignItems: 'center',
    	justifyContent: 'center',
    	paddingTop: Constants.statusBarHeight,
  	},
  	submitButton: {
		marginTop: 0,
		borderWidth: 1,
		borderColor: '#171717',
		backgroundColor: 'rgba(23,23,23,0.9)',
		height: 52,
		width: '80%',
		borderRadius: 10,
		alignItems: 'center',
		justifyContent: 'center',
		flexDirection: 'row'
  	},
  	submitText: {
    	fontSize: 18,
    	color: '#dfdfdf',
  	},
  	buttonContainer: {
		width: '100%',
        alignItems: 'center',
        marginTop: 40		
  	},
});