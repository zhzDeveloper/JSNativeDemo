//
//  JSCallNativeViewController.m
//  ReactNativeDemo
//
//  Created by zhz on 16/01/2018.
//  Copyright © 2018 zhz. All rights reserved.
//

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
    
    NSLog(@"%@ %@", name, date);
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
