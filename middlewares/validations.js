const logger = require("../utils/logger");

const validateChecklist = (req, res, next) => {
  // 1. Verificar el header Content-Type
  if (!req.is("application/json")) {
    logger.error("Content-Type no es application/json", {
      timestamp: new Date().toISOString(),
      description: "El header Content-Type no es application/json",
      endpoint: req.originalUrl,
      body: req.body,
    });
    return res.status(400).json({
      error:
        "Las solicitudes deben hacerse en formato JSON, revisar el header Content-Type",
    });
  }

  // 2. Validar estructura básica del JSON
  const data = req.body;
  const requiredFields = [
    "asunto",
    "ambiente",
    "cliente",
    "resumen",
    "test_store",
    "maquinas_sin_registrar",
    "destinatarios",
  ];

  const errors = []; // Array para almacenar todos los errores

  // Validar campos requeridos
  for (const field of requiredFields) {
    if (data[field] === undefined) {
      const errorMessage = `Campo requerido faltante: ${field}`;
      errors.push(errorMessage);
      logger.error(errorMessage, {
        timestamp: new Date().toISOString(),
        description: `Campo requerido faltante: ${field}`,
        endpoint: req.originalUrl,
        body: req.body,
      });
    }
  }

  // 3. Validar tipos de campos
  if (!Array.isArray(data.maquinas_sin_registrar)) {
    const errorMessage = "El campo 'maquinas_sin_registrar' debe ser un array";
    errors.push(errorMessage);
    logger.error(errorMessage, {
      timestamp: new Date().toISOString(),
      description: errorMessage,
      endpoint: req.originalUrl,
      body: req.body,
    });
  }

  if (!Array.isArray(data.destinatarios)) {
    const errorMessage = "El campo 'destinatarios' debe ser un array";
    errors.push(errorMessage);
    logger.error(errorMessage, {
      timestamp: new Date().toISOString(),
      description: errorMessage,
      endpoint: req.originalUrl,
      body: req.body,
    });
  }

  // 4. Validar estructura anidada (resumen)
  const resumenFields = [
    "total_maquinas",
    "maquinas_sin_registrar_principal",
    "maquinas_registradas_principal",
    "maquinas_sin_registrar_alterno",
    "maquinas_registradas_alterno",
    "maquinas_mantenimiento",
    "maquinas_apagadas",
    "sesiones_totales",
    "sesiones_activas_ultima_hora",
  ];

  for (const field of resumenFields) {
    if (data.resumen[field] === undefined) {
      const errorMessage = `Campo requerido en 'resumen': ${field}`;
      errors.push(errorMessage);
      logger.error(errorMessage, {
        timestamp: new Date().toISOString(),
        description: errorMessage,
        endpoint: req.originalUrl,
        body: req.body,
      });
    } else if (typeof data.resumen[field] !== "number") {
      const errorMessage = `El campo 'resumen.${field}' debe ser un número`;
      errors.push(errorMessage);
      logger.error(errorMessage, {
        timestamp: new Date().toISOString(),
        description: errorMessage,
        endpoint: req.originalUrl,
        body: req.body,
      });
    }
  }

  // 5. Validar destinatarios
  if (Array.isArray(data.destinatarios)) {
    data.destinatarios.forEach((destinatario, index) => {
      if (!destinatario.nombre) {
        const errorMessage = `El destinatario ${index} debe tener un 'nombre'`;
        errors.push(errorMessage);
        logger.error(errorMessage, {
          timestamp: new Date().toISOString(),
          description: errorMessage,
          endpoint: req.originalUrl,
          body: req.body,
        });
      }
      if (!destinatario.correo) {
        const errorMessage = `El destinatario ${index} debe tener un 'correo'`;
        errors.push(errorMessage);
        logger.error(errorMessage, {
          timestamp: new Date().toISOString(),
          description: errorMessage,
          endpoint: req.originalUrl,
          body: req.body,
        });
      }
      if (!destinatario.cargo) {
        const errorMessage = `El destinatario ${index} debe tener un 'cargo'`;
        errors.push(errorMessage);
        logger.error(errorMessage, {
          timestamp: new Date().toISOString(),
          description: errorMessage,
          endpoint: req.originalUrl,
          body: req.body,
        });
      }
    });
  }

  // 6. Si hay errores, devolverlos todos
  if (errors.length > 0) {
    logger.error("Errores de validación", {
      timestamp: new Date().toISOString(),
      description: "Errores de validación en la solicitud",
      endpoint: req.originalUrl,
      body: req.body,
      errors: errors, // Incluir todos los errores en el log
    });
    return res.status(422).json({
      errors: errors, // Devuelve todos los errores en un array
    });
  }

  // 7. Si todo está bien, continuar
  next();
};

const handleJSONErrors = (err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    logger.error('JSON malformado', {
      timestamp: new Date().toISOString(),
      description: err.message,
      endpoint: req.originalUrl, // Endpoint donde ocurrió el error
      body: req.body, // Datos involucrados
    });
    return res.status(400).json({
      error: "JSON malformado. Verifica comillas y llaves",
    });
  }
  next();
};

// Exportar las funciones
module.exports = { validateChecklist, handleJSONErrors };
