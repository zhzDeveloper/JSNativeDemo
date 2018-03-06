//
//  NativeCallJSModule.m
//  ReactNativeDemo
//
//  Created by zhz on 16/01/2018.
//  Copyright © 2018 zhz. All rights reserved.
//

#import "NativeCallJSModule.h"
#import <React/RCTBridgeModule.h>

@interface NativeCallJSModule()<RCTBridgeModule>

@end
@implementation NativeCallJSModule

RCT_EXPORT_MODULE()

- (NSArray<NSString *> *)supportedEvents {
    return @[@"nativeCallJs"];
}

- (void)startObserving {
    [[NSNotificationCenter defaultCenter] addObserver:self
                                             selector:@selector(emitEventInternal:)
                                                 name:@"event-emitted"
                                               object:nil];
}

- (void)stopObserving {
    [[NSNotificationCenter defaultCenter] removeObserver:self];
}

- (void)emitEventInternal:(NSNotification *)notification {
    // 向RN发送消息，body可以是string，dictionary等
    [self sendEventWithName:@"nativeCallJs" body:notification.object];
}

@end
