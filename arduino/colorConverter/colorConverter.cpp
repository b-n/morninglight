#include "colorConverter.h"

uint32_t getValue(uint8_t r, uint8_t g, uint8_t b) {
    return ((uint32_t)r << 16) | ((uint32_t)g <<  8) | b;
}

uint32_t ColorConverter::convertHSL(double h, double s, double l) {
    if (s == 0) return 0;

    double q = l < 0.5 ? l * (1.0 + s) : l + s - l * s;
    double p = 2.0 * l - q;

    return getValue(
        hue2rgb(p, q, h + 1.0/3.0),
        hue2rgb(p, q, h),
        hue2rgb(p, q, h - 1.0/3.0)
    );
}

uint32_t ColorConverter::convertK(double k) {
    return getValue(
        getRvalueFromK(k),
        getGvalueFromK(k),
        getBvalueFromK(k)
    );
}

uint8_t ColorConverter::hue2rgb(double p, double q, double it){
    double t = it;
    if (t < 0) t += 1.0;
    if (t > 1.0) t -= 1.0;
    if (t < 1.0/6.0) return (uint8_t)((p + (q - p) * 6.0 * t)*255);
    if (t < 1.0/2.0) return (uint8_t)(q* 255);
    if (t < 2.0/3.0) return (uint8_t)((p + (q - p) * (2.0/3.0 - t) * 6.0)*255);
    return (uint8_t)(p*255);
}

uint8_t ColorConverter::getRvalueFromK(double k) {
    double a,b,c,x,r;
    if (k < 6600) {
        r = 255.0;
    } else {
        a = 351.97690566805693;
        b = 0.114206453784165;
        c = -40.25366309332127;
        x = (k/100) - 55;
        r = a + b * x + c * log(x);
    }
    return (uint8_t)constrain(r, 0, 255);
}

uint8_t ColorConverter::getGvalueFromK(double k) {
    double a,b,c,x,r;
    if (k < 200) {
        r = 0.0;
    } else if (k < 6600) {
        a = -155.25485562709179;
        b = -0.44596950469579133;
        c = 104.49216199393888;
        x = (k / 100) - 2;
        r = a + b * x + c * log(x);
    } else {
        a = 325.4494125711974;
        b = 0.07943456536662342;
        c = -28.0852963507957;
        x = (k / 100) - 50;
        r = a + b * x + c * log(x);
    }

    return (uint8_t)constrain(r, 0, 255);
}

uint8_t ColorConverter::getBvalueFromK(double k) {
    double a,b,c,x,r;
    if (k <= 1000) {
        r = 0.0;
    } else if (k < 6600) {
        a = -254.76935184120902;
        b = 0.8274096064007395;
        c = 115.67994401066147;
        x = (k/100) - 10;
        r = a + b * x + c * log(x);
    } else {
        r = 255.0;
    }
    return (uint8_t)constrain(r, 0, 255);
}
