//
//  PersonJsExport.h
//  JSNativeDemo
//
//  Created by zhz on 06/03/2018.
//  Copyright © 2018 zhz. All rights reserved.
//

#import <Foundation/Foundation.h>
@import JavaScriptCore;

@protocol PersonJsExport <JSExport>

@property (nonatomic, strong) NSString *name;

- (void)play;

// 调用多个参数的方法, 由于JS函数命名和OC不一样, 很可能调用不到对应的JS生成的函数,
// 为了保证生成的JS函数和OC方法名一直, OC提供了一个宏JSExportAs, 用来告诉JS应该生成什么样的函数对应OC的方法

/* PropertyName: JS函数生成的名字
 * Selector: OC方法名
 * JS会自动生成playGame这方法
 */
JSExportAs(playGame,
           - (void)playWithGame:(NSString *)game time:(NSString *)time);

@end
