
import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    NativeModules,
    NativeEventEmitter
} from 'react-native';

var NativeCallJSModule = NativeModules.NativeCallJSModule;
const Emitter = new NativeEventEmitter(NativeCallJSModule)

export default class extends React.Component {
     
    // JS call native
    onPress = () => {
    }
    
    _getNotice = (body) => {
        alert("这是RN弹窗\n" + body);
    }

    componentWillMount() {
        Emitter.addListener('nativeCallJs', (body) => this._getNotice(body))
    }

    componentWillUnmount() {
        this.subScription.remove();  
    }

    render() {
        return (
            <View style={styles.container}>
                <TouchableOpacity activeOpacity={0.5} onPress={ this.onPress }>
                <Text style={styles.welcome}>
                    点我测试RN调Native!
                </Text>
                </TouchableOpacity>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF'
    },
    welcome: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    }
});