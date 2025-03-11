const winston = require("winston");
const DailyRotateFile = require("winston-daily-rotate-file");
const path = require("path");

const logger = winston.createLogger({
  level: "error",
  format: winston.format.combine(
    winston.format.timestamp(), // Agrega la fecha y hora
    winston.format.json() // Formato JSON para los logs
  ),
  transports: [
    // Registrar logs en la consola
    //new winston.transports.Console(),
  
    // Registrar logs mensualmente
    new DailyRotateFile({
        filename: path.join(__dirname, "logs", "logging-%DATE%.log"),
        datePattern: 'YYYY-MM', // Patrón de fecha para la rotación
        zippedArchive: true,
      })
  ],
});

module.exports = logger;
