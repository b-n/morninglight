// This #include statement was automatically added by the Particle IDE.
#include "application.h"
#include "neopixel/neopixel.h"
#include "elapsedMillis/elapsedMillis.h"
#include <math.h>

#define PIXEL_COUNT 30
#define PIXEL_PIN D2
#define PIXEL_TYPE WS2812B
#define FRAME_RATE 30
#define FRAME_RATE_MS 1000 / FRAME_RATE

#define MAX_K_STEP 25
#define MAX_I_STEP 0.001

Adafruit_NeoPixel strip = Adafruit_NeoPixel(PIXEL_COUNT, PIXEL_PIN, PIXEL_TYPE);
elapsedMillis loopTimer = 0;
elapsedMillis animationTimer = 0;
elapsedMillis durationTimer = 0;

bool isRunning = false;
bool isAnimating = false;

double duration = 0;
double animationDuration = 0;
double startI = 0;
double endI = 0;
double startK = 0;
double endK = 0;
double currentI = 0;
double currentK = 0;

String reqCommand;

void setup() {
    Particle.function("animateLight", handleRequest);

    Particle.variable("si", startI);
    Particle.variable("ei", endI);
    Particle.variable("sk", startK);
    Particle.variable("ek", endK);
    Particle.variable("ci", currentI);
    Particle.variable("ck", currentK);
    Particle.variable("com", reqCommand);

    strip.begin();
    setRGB(0,0,0);
}

void loop() {
    if (loopTimer > FRAME_RATE_MS) {
        runStep();
        loopTimer = 0;
    }
}

void runStep() {
    if (!isRunning) return;

    if (!isAnimating) {
        if (durationTimer > duration) {
            isRunning = false;
            setRGB(0, 0, 0);
        }
        return;
    }

    float progress = getAdjustedProgress(animationTimer / animationDuration);

    if (animationTimer >= animationDuration) {
        progress = 1;
        isAnimating = false;
    }

    currentK = startK + ((endK - startK) * progress);
    currentI = startI + ((endI - startI) * progress);

    setRGB(
        getRvalueFromK(currentK, currentI),
        getGvalueFromK(currentK, currentI),
        getBvalueFromK(currentK, currentI)
    );


    return;
}

float getAdjustedProgress(float progress) {
    double a = 0.85;
    double b = 0.1;
    double c = progress - 0.5;

    return ((c/sqrt(b + pow(c,2))) + a) / (2 * a);
}

int handleRequest(String command) {
    reqCommand = command;

    double values[10];
    int i = 0;
    int currentIndex = -1;
    int newIndex = 0;
    do {
        newIndex = command.indexOf(",", currentIndex+1);
        values[i] = (newIndex == -1
                ? command.substring(currentIndex+1, newIndex)
                : command.substring(currentIndex+1)).toFloat();
        currentIndex = newIndex;
        i++;
    } while (currentIndex != -1);

    if (values[0] == 0) {
        turnOffLight(values);
    } else if (values[0] == 1) {
        animateLight(values);
    }

    isAnimating = true;
    isRunning = true;
    animationTimer = 0;
    durationTimer = 0;

    return (int)values[0];
}

void turnOffLight(double values[]) {
    startK = currentK;
    endK = currentK;
    startI = currentI;
    endI = 0;
    animationDuration = 1000;
    duration = animationDuration;
}

void animateLight(double values[]) {
    startK = values[1];
    startI = values[2];
    endK = values[3];
    endI = values[4];
    animationDuration = values[5];
    duration = values[6];
}

void setRGB(int rVal, int gVal, int bVal) {
    uint32_t c = strip.Color(rVal, gVal, bVal);

    for(uint16_t i=0; i<strip.numPixels(); i++) {
        strip.setPixelColor(i, c);
    }
    strip.show();
}

int getRvalueFromK(double k, double i) {
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

int getGvalueFromK(double k, double i) {
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

int getBvalueFromK(double k, double i) {
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
