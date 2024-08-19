import * as common from './common';
import { Color } from '@nativescript/core';
global.moduleMerge(common, exports);
var TapHandler = /** @class */ (function (_super) {
    __extends(TapHandler, _super);
    function TapHandler() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    TapHandler.prototype.tap = function (args) {
        /** Define tap position */
        var position = args.locationInView(args.view);
        var x = position.x;
        var y = position.y;
        /** Draw 1 pixel canvas in place */
        var pixel = malloc(4 * interop.sizeof(interop.types.uint8));
        var colorSpace = CGColorSpaceCreateDeviceRGB();
        var context = CGBitmapContextCreate(pixel, 1, 1, 8, 4, colorSpace, CGImageAlphaInfo.kCGImageAlphaPremultipliedFirst);
        CGContextTranslateCTM(context, -x, -y);
        args.view.layer.renderInContext(context);
        /** Emit selected color */
        var reference = new interop.Reference(interop.types.uint8, pixel);
        var owner = args.view.owner;
        if (reference.value && owner) {
            owner.notify({
                eventName: 'colorSelect',
                object: Object.assign({}, owner, {
                    isFirstChange: false,
                    color: new Color(reference[0], reference[1], reference[2], reference[3]),
                    colorPosition: { x: x, y: y },
                }),
            });
        }
        /** Release allocated memory */
        // TODO: For some reason such memory release crashes the app. Let's believe in JS Garbage collector until I find correct solution
        // releaseNativeObject(colorSpace);
        // releaseNativeObject(context);
        free(pixel);
    };
    TapHandler.ObjCExposedMethods = {
        tap: { returns: interop.types.void, params: [interop.types.id, interop.types.id] },
    };
    return TapHandler;
}(NSObject));
const handler = new TapHandler();
export class ColorWheel extends common.ColorWheelCommon {
    createNativeView() {
        const imageView = UIImageView.new();
        const tap = new UITapGestureRecognizer({
            target: handler,
            action: 'tap',
        });
        imageView.addGestureRecognizer(tap);
        imageView.userInteractionEnabled = true;
        const colorSpace = CGColorSpaceCreateDeviceRGB();
        const filter = CIFilter.filterWithNameWithInputParameters('CIHueSaturationValueGradient', {
            inputColorSpace: colorSpace,
            inputDither: 0,
            inputRadius: this.radius,
            inputSoftness: 0,
            inputValue: 1,
        });
        const image = UIImage.imageWithCIImage(filter.outputImage);
        imageView.image = image;
        return imageView;
    }
    initNativeView() {
        this.nativeView.owner = this;
        super.initNativeView();
    }
    disposeNativeView() {
        this.nativeView.owner = null;
        super.disposeNativeView();
    }
    [common.colorProperty.setNative](value) {
        const color = value instanceof Color ? value : new Color(value);
        const width = this.nativeView.image.size.width;
        const height = this.nativeView.image.size.height;
        let colorSpace = CGColorSpaceCreateDeviceRGB();
        let bitmapData = malloc(4 * width * height);
        let context = CGBitmapContextCreate(bitmapData, width, height, 8, width * 4, colorSpace, 2);
        const rect = CGRectMake(0, 0, width, height);
        const cgImage = CIContext.new().createCGImageFromRect(this.nativeView.image.CIImage, rect);
        CGContextDrawImage(context, rect, cgImage);
        const reference = new interop.Reference(interop.types.uint8, bitmapData);
        let resX = -1;
        let resY = -1;
        let metrics = Infinity;
        for (let x = 0; x < width; x++) {
            for (let y = 0; y < height; y++) {
                if ((x - this.radius) * (x - this.radius) + (y - this.radius) * (y - this.radius) >= this.radius * this.radius) {
                    continue;
                }
                const red = reference[redOffset(x, y, width)];
                const green = reference[greenOffset(x, y, width)];
                const blue = reference[blueOffset(x, y, width)];
                const distance = Math.abs(red - color.r) + Math.abs(green - color.g) + Math.abs(blue - color.b);
                if (distance < metrics) {
                    metrics = distance;
                    resX = x;
                    resY = y;
                }
            }
        }
        free(bitmapData);
        if (resX > -1 && resY > -1) {
            this.notify({
                eventName: 'colorSelect',
                object: Object.assign({}, this, {
                    isFirstChange: true,
                    color,
                    colorPosition: { x: resX, y: resY },
                }),
            });
        }
    }
}
export function redOffset(x, y, w) {
    return y * w * 4 + x * 4 + 1;
}
export function greenOffset(x, y, w) {
    return y * w * 4 + x * 4 + 2;
}
export function blueOffset(x, y, w) {
    return y * w * 4 + x * 4 + 3;
}
//# sourceMappingURL=index.ios.js.map