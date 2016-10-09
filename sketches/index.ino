int lampPin = D0;
int isOn = 0; // 0 = 'off' ; 1 = 'off'

void setup() {
    pinMode(lampPin, OUTPUT);
    Particle.function("togglelamp", switchOnOff); // name of endpoint , name of function here
    Particle.variable("isOn", &isOn, INT);
}

void loop() {
    delay(10);
}

int switchOnOff(String command) {
    if (command=="off") {
        isOn = 0;
        digitalWrite(lampPin, HIGH);
        return 1;
    }
    else if (command=="on") {
        isOn = 1;
        digitalWrite(lampPin, LOW);
        return 0;
    }
    else {
        return -1;
    }
}
