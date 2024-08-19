import * as common from './common';
import { Color } from '@nativescript/core';
global.moduleMerge(common, exports);
const DEFAULT_ALPHA = 50;
let touchListener;
function initializeClickListener() {
    if (touchListener) {
        return;
    }
    var ClickListener = /** @class */ (function (_super) {
    __extends(ClickListener, _super);
    function ClickListener() {
        var _this = _super.call(this) || this;
        // Required by Android runtime when native class is extended through TypeScript.
        return global.__native(_this);
    }
    ClickListener.prototype.onTouch = function (view, event) {
        // Handle only tap end
        if (event.getAction() !== android.view.KeyEvent.ACTION_UP) {
            return true;
        }
        /** Get the rendered bitmap  */
        var imgDrawable = view.getDrawable();
        // @ts-ignore
        var bitmap = imgDrawable.getBitmap();
        /** Define the coordinates of the tap */
        var eventXY = Array.create('float', 2);
        eventXY[0] = event.getX();
        eventXY[1] = event.getY();
        var invertMatrix = new android.graphics.Matrix();
        view.getImageMatrix().invert(invertMatrix);
        invertMatrix.mapPoints(eventXY);
        var x = eventXY[0];
        var y = eventXY[1];
        // Limit x, y range within bitmap
        if (x < 0) {
            x = 0;
        }
        else if (x > bitmap.getWidth() - 1) {
            x = bitmap.getWidth() - 1;
        }
        if (y < 0) {
            y = 0;
        }
        else if (y > bitmap.getHeight() - 1) {
            y = bitmap.getHeight() - 1;
        }
        /** Get color at the point of tap */
        var touchedRGB = bitmap.getPixel(x, y);
        var owner = view.owner;
        if (touchedRGB && owner) {
            owner.notify({
                eventName: 'colorSelect',
                object: Object.assign({}, owner, {
                    isFirstChange: false,
                    color: new Color(touchedRGB),
                    colorPosition: { x: x, y: y },
                }),
            });
        }
        return true;
    };
    ClickListener = __decorate([
        Interfaces([android.view.View.OnTouchListener]),
        __metadata("design:paramtypes", [])
    ], ClickListener);
    return ClickListener;
}(java.lang.Object));
    touchListener = new ClickListener();
}
export class ColorWheel extends common.ColorWheelCommon {
    createNativeView() {
        const radius = this.radius;
        const view = new android.widget.ImageView(this._context);
        const bitmap = android.graphics.Bitmap.createBitmap(2 * radius, 2 * radius, android.graphics.Bitmap.Config.ARGB_8888);
        const canvas = new android.graphics.Canvas(bitmap);
        initializeClickListener();
        const huePaint = new android.graphics.Paint(android.graphics.Paint.ANTI_ALIAS_FLAG);
        const hueShader = new android.graphics.SweepGradient(radius, radius, colorSpectra(), colorDistribution());
        huePaint.setShader(hueShader);
        const saturationPaint = new android.graphics.Paint(android.graphics.Paint.ANTI_ALIAS_FLAG);
        const satShader = new android.graphics.RadialGradient(radius, radius, radius, android.graphics.Color.WHITE, 0x00ffffff, android.graphics.Shader.TileMode.CLAMP);
        saturationPaint.setShader(satShader);
        canvas.drawCircle(radius, radius, radius, huePaint);
        canvas.drawCircle(radius, radius, radius, saturationPaint);
        view.setImageBitmap(bitmap);
        view.setOnTouchListener(touchListener);
        return view;
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
        const imgDrawable = this.nativeView.getDrawable();
        const bitmap = imgDrawable.getBitmap();
        const bitmapWidth = bitmap.getWidth();
        const bitmapHeight = bitmap.getHeight();
        let resX = -1;
        let resY = -1;
        let metrics = 10;
        for (let x = 0; x < bitmapWidth; x++) {
            for (let y = 0; y < bitmapHeight; y++) {
                if ((x - this.radius) * (x - this.radius) + (y - this.radius) * (y - this.radius) >= this.radius * this.radius) {
                    continue;
                }
                const touchedRGB = bitmap.getPixel(x, y);
                const touchedColor = new Color(touchedRGB);
                const distance = Math.abs(touchedColor.r - color.r) + Math.abs(touchedColor.g - color.g) + Math.abs(touchedColor.b - color.b);
                if (distance < metrics) {
                    metrics = distance;
                    resX = x;
                    resY = y;
                }
            }
        }
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
export function colorSpectra() {
    const colors = Array.create('int', 7);
    colors[0] = android.graphics.Color.RED;
    colors[1] = android.graphics.Color.MAGENTA;
    colors[2] = android.graphics.Color.BLUE;
    colors[3] = android.graphics.Color.CYAN;
    colors[4] = android.graphics.Color.GREEN;
    colors[5] = android.graphics.Color.YELLOW;
    colors[6] = android.graphics.Color.RED;
    return colors;
}
export function colorDistribution() {
    const sectors = Array.create('float', 7);
    sectors[0] = 0.0;
    sectors[1] = 0.166;
    sectors[2] = 0.333;
    sectors[3] = 0.499;
    sectors[4] = 0.666;
    sectors[5] = 0.833;
    sectors[6] = 0.999;
    return sectors;
}
//# sourceMappingURL=index.android.js.map