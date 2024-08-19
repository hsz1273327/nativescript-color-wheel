import * as common from './common';
import { ColorWheel as ColorWheelDefinition } from '.';
export declare class ColorWheel extends common.ColorWheelCommon implements ColorWheelDefinition {
    nativeView: UIImageView;
    createNativeView(): Object;
    initNativeView(): void;
    disposeNativeView(): void;
}
export declare function redOffset(x: any, y: any, w: any): number;
export declare function greenOffset(x: any, y: any, w: any): number;
export declare function blueOffset(x: any, y: any, w: any): number;
