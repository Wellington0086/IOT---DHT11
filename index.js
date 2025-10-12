const { SerialPort } = require("serialport");
const { ReadlineParser } = require("@serialport/parser-readline");
const mqtt = require("mqtt");

// Porta do Arquivo (ajuste "COM3" no Windows ou "/dev/ttyUSB0" no Linux)
const port = new SerialPort({ path: "COM3", baudRate: 9600 });
const parser = port.pipe(new ReadlineParser({ delimiter: "\n" }));

// Conecxão ao Brocker MQTT público HiveMQ
const client = mqtt.connect("mqtt://broker.hivemq.com:1883");
const topic = "seani/iot/dht11";

client.on("connect", () => {
  console.log("Conectado ao broker MQTT!");
});

parser.on("data", (line) => {
  try {
    const data =JSON.parse(line.trim());
    console.log("recebido:", data);

    client.publish(topic, JSON.stringify(data));
    console.log("Publicado no MQTT:", data);
  } catch (err) {
    console.error("Erro ao parsear:", line);
  }
});