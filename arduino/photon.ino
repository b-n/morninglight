#include <math.h>
#include "application.h"

#include "colorConverter.h"
#include "neopixel/neopixel.h"
#include "elapsedMillis/elapsedMillis.h"

#define PIXEL_COUNT 60
#define PIXEL_PIN D2
#define PIXEL_TYPE WS2812B
#define FRAME_RATE 30
#define FRAME_RATE_MS 1000/FRAME_RATE

#define MAX_K_STEP 25
#define MAX_I_STEP 0.001

uint32_t RGB_DARK_CYAN = 0x00000505;

Adafruit_NeoPixel strip = Adafruit_NeoPixel(PIXEL_COUNT, PIXEL_PIN, PIXEL_TYPE);
ColorConverter converter = ColorConverter();
elapsedMillis loopTimer = 0;
elapsedMillis animationTimer = 0;
elapsedMillis durationTimer = 0;

bool isRunning = false;
bool isAnimating = false;
int animation = 0;
double duration = 0;
double animationDuration = 0;

double startI = 0;
double endI = 0;
double currentI = 0;
double startK = 0;
double endK = 0;
double currentK = 0;

double startHue = 0;
double ledHueOffset = 0;
double saturation = 0;
double lightness = 0;
double debug = 0;

String reqCommand;

void setup() {
    LEDSystemTheme theme;
    theme.setColor(LED_SIGNAL_CLOUD_CONNECTED, RGB_DARK_CYAN);
    theme.setPattern(LED_SIGNAL_CLOUD_CONNECTED, LED_PATTERN_SOLID);
    theme.apply();

    Particle.function("animateLight", handleRequest);

    Particle.variable("si", startI);
    Particle.variable("ei", endI);
    Particle.variable("sk", startK);
    Particle.variable("ek", endK);
    Particle.variable("ci", currentI);
    Particle.variable("ck", currentK);
    Particle.variable("com", reqCommand);
    Particle.variable("animation", animation);
    Particle.variable("debug", debug);

    strip.begin();
    setAllRGB(0);
}

void loop() {
    if (loopTimer < FRAME_RATE_MS) return;
    loopTimer = 0;

    if (!isRunning) return;

    switch (animation) {
        case 1:
            runKAnimate();
            break;
        case 2:
            runHSLAnimate();
            break;
        default:
            runOffAnimate();
            break;
    }
}

void runOffAnimate() {
    if (durationTimer > duration) {
        animation = 0;
        isRunning = false;
        strip.setBrightness(0);
        setAllRGB(0);
        return;
    }
    double progress = durationTimer / duration;

    if (progress >= 1) progress = 1;

    currentI = startI + ((endI - startI) * progress);
    strip.setBrightness((int8_t)(currentI*255));
    strip.show();
}

void runKAnimate() {
    if (!isAnimating) {
        if (durationTimer > duration) animateTurnOffLight();
        return;
    }

    float progress = getSinsodalProgress(animationTimer / animationDuration);

    if (animationTimer >= animationDuration) {
        progress = 1;
        isAnimating = false;
    }

    currentK = startK + ((endK - startK) * progress);
    currentI = startI + ((endI - startI) * progress);

    uint32_t color = converter.convertK(currentK);
    setAllRGB(color);
    strip.setBrightness((uint8_t)(currentI*255));
    strip.show();
}

void runHSLAnimate() {
    debug = durationTimer;
    if (durationTimer > duration) {
        animateTurnOffLight();
        return;
    }

    if (animationTimer > animationDuration) animationTimer = 0;

    double progress = animationTimer / animationDuration;

    double hue = startHue + progress;

    for(uint16_t i=0; i<strip.numPixels(); i++) {
        double ledHue = (hue + (double)i * ledHueOffset);
        double clampedHue = ledHue - ((int)ledHue);
        uint32_t color = converter.convertHSL(clampedHue, saturation, lightness);
        strip.setPixelColor(i, color);
    }

    strip.show();
}

float getSinsodalProgress(float progress) {
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

    animation = (int)values[0];
    switch (animation) {
        case 1:
            animateK(values);
            break;
        case 2:
            animateHSL(values);
            break;
        default:
            animateTurnOffLight();
            break;
    }

    isRunning = true;
    return animation;
}

void animateTurnOffLight() {
    startI = currentI;
    endI = 0;
    animation = 0;
    duration = 1000;
    durationTimer = 0;
}

void animateK(double values[]) {
    startK = values[1];
    startI = values[2];
    endK = values[3];
    endI = values[4];
    animationDuration = values[5];
    duration = values[6];

    isAnimating = true;
    animationTimer = 0;
    durationTimer = 0;
}

void animateHSL(double values[]) {
    strip.setBrightness(255);
    startHue = values[1];
    saturation = values[2];
    lightness = values[3];
    ledHueOffset = values[4];
    animationDuration = values[5];
    duration = values[6];

    currentI = (double)1;
    animationTimer = 0;
    durationTimer = 0;
}

void setAllRGB(uint32_t color) {
    for(uint16_t i=0; i<strip.numPixels(); i++) {
        strip.setPixelColor(i, color);
    }
    strip.show();
}
