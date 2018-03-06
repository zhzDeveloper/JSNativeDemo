//
//  UILableJSExport.h
//  JSNativeDemo
//
//  Created by zhz on 06/03/2018.
//  Copyright © 2018 zhz. All rights reserved.
//

#import <Foundation/Foundation.h>
@import JavaScriptCore;

@protocol UILableJSExport <JSExport>

@property (nonatomic, strong) NSString *text;

@end
