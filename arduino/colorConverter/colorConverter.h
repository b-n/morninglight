#ifndef COLOR_CONVERTER_H
#define COLOR_CONVERTER_H

#include "Particle.h"
#include "math.h"

class ColorConverter {

    public:
        ColorConverter() {};
        uint32_t convertK(double k);
        uint32_t convertHSL(double h, double s, double l);

    private:
        static uint8_t
            hue2rgb(double p, double q, double it),
            getRvalueFromK(double k),
            getGvalueFromK(double k),
            getBvalueFromK(double k);
};

#endif
