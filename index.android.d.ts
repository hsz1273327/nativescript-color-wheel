import * as common from './common';
import { ColorWheel as ColorWheelDefinition } from '.';
export declare class ColorWheel extends common.ColorWheelCommon implements ColorWheelDefinition {
    nativeView: android.widget.ImageView;
    createNativeView(): Object;
    initNativeView(): void;
    disposeNativeView(): void;
}
export declare function colorSpectra(): any;
export declare function colorDistribution(): any;
