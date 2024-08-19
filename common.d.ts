import { Color, Property, View } from '@nativescript/core';
export declare const colorProperty: Property<ColorWheelCommon, string>;
export declare class ColorWheelCommon extends View {
    static colorSelectEvent: string;
    color: Color;
    protected get radius(): number;
}
