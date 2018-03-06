//
//  Person.m
//  JSNativeDemo
//
//  Created by zhz on 06/03/2018.
//  Copyright © 2018 zhz. All rights reserved.
//

#import "Person.h"

@implementation Person

- (void)play {
    NSLog(@"play");
}

- (void)playWithGame:(NSString *)game time:(NSString *)time {
    NSLog(@"playWith %@ time: %@", game, time);
}


@end
