import React from 'react';
import {
    AppRegistry,
    View,
    Text,
    NativeModules
} from 'react-native';
// import App from './callNative';

const JSCallNativeModule = NativeModules.JSCallNativeModule
const date = new Date;
class ContainterView extends React.Component {
    render() {
        return (
            <View style={{flex: 1, backgroundColor:'red'}}>
                <Text style={{top: 100, height: 35, backgroundColor:'blue'}} onPress={() => this._onClick()}> 点击call native </Text>
            </View>
        )
    }
    _onClick() {
        alert(JSCallNativeModule.firstDayOfTheWeek)
        JSCallNativeModule.printMyself('看看效果', date.getTime(), this._callback)
    }   

    _callback(firstParm, secondParm, thirdParm) {
        alert(firstParm + secondParm + thirdParm)
    }

}

AppRegistry.registerComponent('JSNativeDemo', () => ContainterView);