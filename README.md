

# 一. 概念
`JavaScriptCore框架` 是苹果在iOS7引入的框架，该框架让 Objective-C 和 JavaScript 代码直接的交互变得更加的简单方便。
`JavaScriptCore框架` 其实就是基于 [webkit](https://webkit.org/) 中以C/C++实现的JavaScriptCore
的一个包装

# 二. JavaScriptCore框架常用类
![](media/15203182210057/15203226997681.jpg)

1. **JSContext**: JS运行的环境, 为JS代码的执行提供了上下文环境, 并且通过JSContext获取JS的数据
2. **JSValue**: 用于接受JS中获取的数据类型, 可以使对象, 方法
3. **[JSManagedValue](https://www.jianshu.com/p/0f408b651e2f)**: 用来包装JSValue对象
4. **[JSVirtualMachine](https://www.jianshu.com/p/ef9bb208bf7e)**: JavaScript虚拟机, 每一个JavaScript上下文(也就是一个JSContext对象)归属于一个虚拟机。每一个虚拟机可以包含多个不同的上下文，而且可以在不同的上下文之间传值(JSValue对象)。但是，每一个虚拟机都是独立的——你不能将在一个虚拟机中创建的值传到另一个虚拟机的一个上下文中
5. **JSExport**: protocol，如果JS对象想直接调用OC对象里面的方法和属性，那么这个OC对象需要实现这个JSExport协议

#### **js OC type 转换**

| Objective-C type | JavaScript type |
| :---: | :---: |
| nil | undefined |
| NSNull | null |
| NSString | string |
| NSNumber | number, boolean |
| NSDictionary | Object object |
| NSArray | Array object |
| NSDate | Date object |
| NSBlock (1) | Function object (1) |
| id (2) | Wrapper object (2) |
| Class (3) | Constructor object (3) |
  
# 三. JS 和 OC 互调
***必须创建JS运行环境***

### 1. OC调用JS
本质: JS代码中已经定义好变量和方法, 用过OC去获取, 并且调用
步骤:
    1. 创建JS运行环境
    2. 执行JS代码
    3. 获取JS数据(变量, 方法)
    4. 使用JS数据, 方法
    
#### 变量的调用
    
```
    JSContext *context = [[JSContext alloc] init];
    
    NSString *jsCode = @"let arr = [1, 2, 3]";
    [context evaluateScript:jsCode];
    
    // 只有执行JS代码才能获取数据
    // 变量定义在JS中, 所以直接通过JSContext获取, 根据变量名称获取, 相当于字典的key
    JSValue *reJsValue = context[@"arr"];
    NSLog(@"%@", reJsValue);   // 1,2,3
    
    // 修改JS的值
    reJsValue[0] = @9;
    NSLog(@"%@", reJsValue);  // 9,2,3
    
    // 值转换
    if (reJsValue.isArray) {
        NSLog(@"jsValue to Array %@", reJsValue.toArray);
    }
```

#### 方法的调用

```
    NSString *jsCode = @"function hello(params) {return 'hello ' + params;}";
    
    // 创建JS运行环境
    JSContext *context = [[JSContext alloc] init];
    
    // 执行JS代码
    [context evaluateScript:jsCode];
    
    JSValue *hello = context[@"hello"];
    
    // OC 调用JS方法, 获取返回值
    JSValue *reValue = [hello callWithArguments:@[@"javascript"]];
    NSLog(@"reValue: %@", reValue); // reValue: hello javascript
```

### 2. JS调用OC方法

- **Block**: 使用block可以很方便的将OC中的单个方法暴露给JS调用
- **JSExport 协议**: 使用JSExport协议，可以将OC的中某个对象直接暴露给JS使用，而且在JS中使用就像调用JS的对象一样自然

> 简而言之，Block是用来  `暴露单个方法的`，而JSExport 协议可以`暴露一个OC对象`

#### block

```
    //1. 创建JS运行的环境
    JSContext *context = [[JSContext alloc] init];
    
    //2. @selector(eat) 对象类型的值
    context[@"eat"] = ^(NSString *sm, NSString *string) {
        NSLog(@"eat call: %@  %@", sm, string);
    };
    
    //3. 执行JS
    [context evaluateScript:@"eat('aaaa', 'bbbb')"]; // eat call: aaaa  bbbb
```

#### class 
本质: 一开始JS中并没有OC的类, 需要先在JS中生成OC的类, 然后通过JS调用
步骤:
    1. OC类必须遵守JSExport协议, 只要遵守JSExport协议, JS才会生成这个类(但是不会生成属性和方法)
    2. 自定义一个集成JSExport的协议的, 在自己的协议中暴露需要在JS中用到的属性和方法
    3. 自定义的类遵守自定义的协议, JS就会自动生成类, 包括协议中的属性和方法

##### 自定义类
```
    Person *person = [[Person alloc] init];
    person.name = @"tom";
    
    // 1. 创建JS运行环境
    JSContext *context = [[JSContext alloc] init];
    
    // 会在JS中生成person对象, 并且拥有协议定义好的值
    context[@"Person"] = person;
    
    // 执行JS代码
    NSString *jsCode = @"Person.playGame('足球', '中午')";
    [context evaluateScript:jsCode]; // playWith 足球 time: 中午
    
    NSString *jsCode2 = @"var name = Person.name";
    [context evaluateScript:jsCode2];
    JSValue *name = context[@"name"];
    NSLog(@"%@", name.toString); // tom
    
    NSString *jsCode3 = @"Person.name = '11111'";
    [context evaluateScript:jsCode3];
    NSLog(@"%@", person.name); // 11111
```
#### 系统类

```
    // 给系统类添加协议
    class_addProtocol([UILabel class], @protocol(UILableJSExport));
    // 创建UILabel
    UILabel *label = [[UILabel alloc] initWithFrame:CGRectMake(50, 50, 200, 100)];
    [self.view addSubview:label];
    
    // 1. 创建JS运行环境
    JSContext *context = [[JSContext alloc] init];
    // JS自动生成label对象
    context[@"label"] = label;
    
    //执行JS代码
    NSString *jsCode = @"label.text = '显示的什么东西呢'";
    
    [context evaluateScript:jsCode];
```
![](media/15203182210057/15203303790515.jpg)




**注意**: 
使用 Block 的坑

`不要在Block中直接使用JSValue`
`不要在Block中直接使用JSContext`

因为Block会强引用它里面用到的外部变量，如果直接在Block中使用JSValue的话，那么这个JSvalue就会被这个Block强引用，而每个JSValue都是强引用着它所属的那个JSContext的，这是前面说过的，而这个Block又是注入到这个Context中，所以这个Block会被context强引用，这样会造成循环引用，导致内存泄露。不能直接使用JSContext的原因同理。

那怎么办呢，针对第一点，建议把JSValue当做参数传到Block中，而不是直接在Block内部使用，这样Block就不会强引用JSValue了。
针对第二点，可以使用[JSContext currentContext] 方法来获取当前的Context。

```
self.jsContext[@"jsCallNative"] = ^(NSString *paramer){
        // 会引起循环引用
        JSValue *value1 =  [JSValue valueWithNewObjectInContext:self.jsContext];
        // 不会引起循环引用
        JSValue *value =  [JSValue valueWithNewObjectInContext:[JSContext currentContext]];
};

```

案例: 
[JSPatch](https://github.com/bang590/JSPatch/blob/master/JSPatch/JPEngine.m)
![](media/15203182210057/15203308558232.jpg)


**ReactNative 中交互**

步骤:
1. 遵守RCTBridgeModule
2. RCT_EXPORT_MODULE 导出js中对应的模块
3. 导出方法, 属性, 常量等

OC

```
#import "JSCallNativeModule.h"
#import <React/RCTBridgeModule.h>

@interface JSCallNativeModule ()<RCTBridgeModule>

@end

@implementation JSCallNativeModule

RCT_EXPORT_MODULE()  // js_name js模块的名字, 不传则默认导出本身

// 原生模块可以导出一些常量，这些常量在JavaScript端随时都可以访问。用这种方法来传递一些静态数据，可以避免通过bridge进行一次来回交互。
// Javascript端可以随时同步地访问这个数据：`console.log(CalendarManager.firstDayOfTheWeek)`
- (NSDictionary<NSString *,id> *)constantsToExport {
    return @{
             @"firstDayOfTheWeek": @"Monday"
    };
}

//JS中调用Native的方法：此处响应
RCT_EXPORT_METHOD(printMyself:(NSString *)name date:(NSDate *)date callback:(RCTResponseSenderBlock)callback) {
    
    NSLog(@"%@ %@", name, date); // 看看效果 Tue Mar  6 18:55:20 2018
    callback(@[@(2), @(3), @(4)]);
}

// 如果桥接原生方法的最后两个参数是RCTPromiseResolveBlock和RCTPromiseRejectBlock，
// 则对应的JS方法就会返回一个Promise对象
RCT_REMAP_METHOD(findeEvents,
                 resolver:(RCTPromiseResolveBlock)resolver
                 rejecter:(RCTPromiseRejectBlock)rejecter) {
    dispatch_after(dispatch_time(DISPATCH_TIME_NOW, (int64_t)(5 * NSEC_PER_SEC)), dispatch_get_main_queue(), ^{
        
        NSArray *events = @[@"da", @"fasf"];
        if (events) {
            resolver(events);
        } else {
            rejecter(@"-1", @"error msg", nil);
        }
    });
}

@end

```

JS

```
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
```

```
```

待解决问题:
1. 打包生成的jsbundle体积较大(>500k)
2. 首次加载js较慢

[参考](https://www.jianshu.com/p/bd7dfd8c9917)

[WWDC2013](https://developer.apple.com/videos/play/wwdc2013/615/)
