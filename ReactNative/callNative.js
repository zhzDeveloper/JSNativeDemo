import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    NativeModules,
    UIManager,
    NativeEventEmitter
} from 'react-native';
import MyLabel from "./MapView";

var JSCallNativeModule = NativeModules.JSCallNativeModule;

var date = new Date;
export default class extends React.Component {
    
    callback = (firstParm, secondParm, thirdParm) => {
        alert(firstParm)
    }

    // JS call native
    onPress = () => {
        JSCallNativeModule.printMyself('看看效果', date.getTime(), this.callback)
    }

    render() {
        return (
            <View style={styles.container}>
                <MyLabel text='aaa' textColor='red' backgroundColor='#fff' style={{width: 100, height: 20}}></MyLabel>
                <TouchableOpacity activeOpacity={0.5} onPress={ this.onPress }>
                    <Text style={styles.welcome}>
                        点我测试RN调Native Module!
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity activeOpacity={0.5} onPress={ this.onPress }>
                    <Text style={styles.welcome}>
                        点我测试RN调Native UI!
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
