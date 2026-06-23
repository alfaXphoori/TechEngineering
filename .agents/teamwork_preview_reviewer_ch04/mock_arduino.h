#ifndef MOCK_ARDUINO_H
#define MOCK_ARDUINO_H

#include <iostream>
#include <cstdint>
#include <string>

#define HIGH 1
#define LOW 0
#define INPUT 0
#define OUTPUT 1
#define INPUT_PULLUP 2

inline void pinMode(uint8_t, uint8_t) {}
inline void digitalWrite(uint8_t, uint8_t) {}
inline int digitalRead(uint8_t) { return HIGH; }
inline int analogRead(uint8_t) { return 500; }
inline unsigned long millis() { return 0; }
inline void delay(unsigned long) {}

class MockSerial {
public:
    void begin(unsigned long) {}
    void print(const std::string &s) { std::cout << s; }
    void print(double d) { std::cout << d; }
    void print(int i) { std::cout << i; }
    void println(const std::string &s) { std::cout << s << std::endl; }
    void println(double d) { std::cout << d << std::endl; }
    void println(int i) { std::cout << i << std::endl; }
};

extern MockSerial Serial;

#endif
