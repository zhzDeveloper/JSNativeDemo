//
//  Person.h
//  JSNativeDemo
//
//  Created by zhz on 06/03/2018.
//  Copyright © 2018 zhz. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "PersonJsExport.h"

@interface Person : NSObject <PersonJsExport>

@property (nonatomic, strong) NSString *name;

@end
