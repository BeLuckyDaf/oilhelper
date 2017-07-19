import { Constants } from 'expo';
import React, { Component } from 'react';
import { Text, View, StyleSheet, TextInput, TouchableOpacity, KeyboardAvoidingView, ActivityIndicator, Image } from 'react-native';
import { NavigationActions } from 'react-navigation';

import Loading from './Loading';

export default class Login extends Component {

	//SAYS IT WAS DEPRECATED, ALLRIGHT THEN
	// static propTypes = {
	// 	error: PropTypes.number.isRequired,
	// 	errorMessage: PropTypes.string,
	// }

	static navigationOptions = {
		title: 'Авторизация',
	}

	constructor(props) {
		super(props);

		this.state = {
			username: "",
			password: "",
			checking: false,
			allActive: false,
			showError: 0 // 0 or 1
 		};
	}
  
	_handleTextChange = username => {
		this.setState({ username });
	};
	_handlePassChange = password => {
		this.setState({ password });
	};
	  
  	render() {
		
		let bg = require('./assets/bg/bg.png');
    	let error = this.props.navigation.state.params.error;
		let errorMessage = this.props.navigation.state.params.errorMessage;

		if (error === undefined || errorMessage === undefined) {
			error = 0;
			errorMessage = '';
		}

		return (
			<Image source={bg} style={{ alignSelf: 'stretch', flex: 1 }}>
				<View style={{ height: 80 }} />
      			<KeyboardAvoidingView behavior='padding' style={styles.container}>
        			<TextInput
          				keyboardType='default'
						returnKeyType='done'
						autoCapitalize='none'
						autoCorrect={false}
						placeholder='Логин'
						placeholderTextColor='#ddd'
						value={this.state.username}
						onChangeText={this._handleTextChange}
						style={{ width: '80%', height: 44, paddingLeft: 16, borderRadius: 10, marginLeft: '10%', backgroundColor: 'rgba(0,0,0,0.4)', color: '#eee' }}/>
        
					<TextInput
						autoCapitalize='none'
						autoCorrect={false}
						placeholder='Пароль'
						placeholderTextColor='#ddd'
						value={this.state.password}
						onChangeText={this._handlePassChange}
						secureTextEntry={true}
						onSubmitEditing={this._Login}
						returnKeyType='go'
						style={{ width: '80%', height: 44, paddingLeft: 16, borderColor: '#d4d4d4', borderWidth: 0, borderRadius: 10, marginLeft: '10%', marginTop: 16, backgroundColor: 'rgba(0,0,0,0.4)', color: '#eee' }}/>
        
					<View style={{ height: 64, alignItems: 'center', justifyContent: 'center' }}>
						<ActivityIndicator animating={this.state.checking} size='large'/>
					</View>
			
					<TouchableOpacity onPressOut={this._Login} style={styles.buttonContainer}>
						<View style={styles.submitButton} >
							<Text style={styles.submitText}>ВХОД</Text>
						</View >
					</TouchableOpacity>
			
					<View style={{ backgroundColor: 'rgba(255,255,255,0.6)', opacity: error, borderRadius: 10, marginTop: 15, width: '80%' }}>
						<Text style={{ fontSize: 12, color: 'red', margin: 15, textAlign: 'center' }}>
							{errorMessage}
						</Text>
					</View>
      			</KeyboardAvoidingView>
	  		</Image>
    	);
  	}

	_Login = () => {
		// this.props.navigator.push({
		// 	component: Loading,
		// 	passProps: { username: this.state.username, password: this.state.password },
		// });
		//this.props.navigation.navigate('Loading', { username: this.state.username, password: this.state.password });
		this.props.navigation.dispatch(NavigationActions.reset({
			index: 0,
			actions: [
				NavigationActions.navigate({ routeName: 'Loading', params: { username: this.state.username, password: this.state.password } }),
				//NavigationActions.navigate({ routeName: 'Loading'}),
			]
		}));
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
		alignItems: 'center'		
  	},
});

