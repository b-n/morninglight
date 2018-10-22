// This #include statement was automatically added by the Particle IDE.
#include "application.h"
#include "neopixel/neopixel.h"
#include "elapsedMillis/elapsedMillis.h"
#include <math.h>

#define PIXEL_COUNT 30
#define PIXEL_PIN D2
#define PIXEL_TYPE WS2812B

#define MAX_K_STEP 25
#define MAX_I_STEP 0.001

Adafruit_NeoPixel strip = Adafruit_NeoPixel(PIXEL_COUNT, PIXEL_PIN, PIXEL_TYPE);
elapsedMillis timer;

int remainingSteps = 0;
int animationSteps = 0;
double kStepSize = 0.0;
double iStepSize = 0.0;
double tStepSize = 0.0;
double currentK = 5500.0;
double currentI = 0.0;
String reqCommand;

int rValue=0,gValue=0,bValue=0;

void setup() {
    timer = 0;
    Particle.function("animateLight", animateLightStr);
    Particle.variable("kc", currentK);
    Particle.variable("ic", currentI);
    Particle.variable("ks", kStepSize);
    Particle.variable("is", iStepSize);
    Particle.variable("ts", tStepSize);
    Particle.variable("rem", remainingSteps);
    Particle.variable("com", reqCommand);

    strip.begin();
    strip.show();
    remainingSteps++; //run once on loop
}

void loop() {
    if (timer > tStepSize) {
        runStep();
        timer = 0;
    }
}

int animateLightStr(String command) {
    reqCommand = command;

    double values[6];
    int i = 0;
    int currentIndex = 0;
    int newIndex = 0;
    do {
        newIndex = command.indexOf(",", currentIndex+1);
        values[i] = (newIndex == -1
                ? command.substring(currentIndex+1, newIndex)
                : command.substring(currentIndex+1)).toFloat();
        currentIndex = newIndex;
        i++;
    } while (currentIndex != -1);

    animateLight(values[0], values[1], values[2], values[3], values[4], values[5]);
    return remainingSteps;
}

void animateLight(double startTemp, double startIntensity, double endTemp, double endIntensity, double animateDuration, double totalDuration) {
    currentK = startTemp;
    currentI = startIntensity;

    double tempDiff = fabs(endTemp - startTemp);
    double intensityDiff = fabs(endIntensity - startIntensity);

    double tempSteps = tempDiff/MAX_K_STEP;
    double intensitySteps = intensityDiff/MAX_I_STEP;

    animationSteps = (int)(tempSteps > intensitySteps ? tempSteps : intensitySteps);

    kStepSize = tempDiff / animationSteps;
    iStepSize = intensityDiff / animationSteps;
    tStepSize = animateDuration / animationSteps;

    remainingSteps = (totalDuration / animateDuration) * animationSteps;
}

void runStep() {
    if (remainingSteps < 0) return;

    if (remainingSteps == 0) setRGB(0,0,0);

    if (animationSteps >= 0) {
        setRGB(
                getRvalue(currentK, currentI),
                getGvalue(currentK, currentI),
                getBvalue(currentK, currentI)
              );

        currentK += kStepSize;
        currentI += iStepSize;
        animationSteps--;
    }
    remainingSteps--;
}

void setRGB(int rVal, int gVal, int bVal) {
    uint32_t c = strip.Color(rVal, gVal, bVal);

    for(uint16_t i=0; i<strip.numPixels(); i++) {
        strip.setPixelColor(i, c);
    }
    strip.show();
}

int getRvalue(double k, double i) {
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
    return getSafeIntensityValue(r, i);
}

int getGvalue(double k, double i) {
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

    return getSafeIntensityValue(r, i);
}

int getBvalue(double k, double i) {
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
    return getSafeIntensityValue(r, i);
}

int getSafeIntensityValue(double v, double i) {
    double r = (v * i);
    if (r < 0) r = 0;
    if (r > 255) r = 255;
    return (int)r;
}
