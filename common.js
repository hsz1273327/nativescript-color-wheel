import { Property, View } from '@nativescript/core';
import { Screen } from '@nativescript/core/platform';
export const colorProperty = new Property({
    name: 'color',
    defaultValue: '',
});
export class ColorWheelCommon extends View {
    get radius() {
        const width = this.width;
        const height = this.height;
        let minBound;
        if (typeof width === 'number' && typeof height === 'number') {
            minBound = width < height ? width : height;
        }
        else {
            minBound = Screen.mainScreen.widthDIPs;
        }
        return minBound / 2;
    }
}
ColorWheelCommon.colorSelectEvent = 'colorSelect';
colorProperty.register(ColorWheelCommon);
//# sourceMappingURL=common.js.map