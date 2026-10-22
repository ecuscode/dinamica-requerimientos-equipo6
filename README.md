# Protocolo de Inspección de Requerimientos: Compuertas Ágiles (GO / PIVOT / KILL)
## Guía Metodológica, Banco de Casos y Facilitación de Dinámica Interactiva

**Unidad de Aprendizaje:** Ingeniería de Requerimientos  
**Temas del Programa:** 3.2 (Artefactos RAD), 3.3 (Reglas de Negocio en Metodologías Ágiles) y 3.4 (Metodologías Ágiles en Casos Reales)  
**Institución:** Instituto Politécnico Nacional — UPIICSA  
**Grupo:** 3NV30  
**Docente:** Ma. Eugenia Mares Romero  
**Equipo Expositor (Equipo 6):** Astrid Fuentes Ordoñez, David Eduardo Meza Arreguin, Leonardo Iván Olvera Ortega, Angel Yahir Valencia Oropeza  
**Duración Planificada:** 5 a 6 minutos (Integrada al cierre de la exposición)

---

## 1. Justificación y Fundamentación Pedagógica

La presente dinámica abandona el formato de cuestionario memorístico genérico para situar a los oyentes en una **simulación industrial de toma de decisiones técnicas**. 

Se basa directamente en el marco empírico de **Shim & Lee (2026)** publicado en *IEEE Access*, el cual demuestra que los equipos ágiles convencionales sufren de **inercia del sprint**: por mantener la velocidad y la cadencia de entrega, admiten historias de usuario ambiguas o carentes de evidencia de negocio, provocando que los programadores construyan velozmente la solución equivocada y acumulando altos volúmenes de retrabajo.

Para combatir este fenómeno, la dinámica somete seis situaciones reales de ingeniería de software a un protocolo de compuertas ligeras guiado por el valor de la certidumbre y el aprendizaje (*Value of Uncertainty and Learning - VOUL*), evaluando:
1. **Artefactos RAD (James Martin, 1991):** Prototipos evolutivos y sesiones JAD para resolver omisiones de requerimientos implícitos.
2. **Reglas de Negocio (Business Rules Group, 2000 & OMG DMN 1.5):** Desacoplamiento de la lógica de decisiones frente a la tecnología, política de acierto *Unique* y formalización en BDD/Gherkin (*Dado/Cuando/Entonces*).
3. **Gobernanza Arquitectónica y Normativa (ISO/IEC 25010 e ISO/IEC/IEEE 29148):** Detección de negligencia en atributos de calidad no funcionales (seguridad, rendimiento) y combate al "agilismo de etiqueta" (*Cao & Ramesh, 2008; Toro Lazo & Peláez Valencia, 2016*).

---

## 2. Mecánica Operativa y Reglas de la Dinámica

### 2.1. Roles de los Participantes
Cada compañero del grupo 3NV30 participa de forma individual o por parejas desde su dispositivo móvil, asumiendo el rol de **Ingeniero Dictaminador de la Célula de Inspección**.

### 2.2. Opciones de Decisión por Caso
En cada ronda se proyecta un caso con su contexto, historia de usuario y condición técnica. Cada participante dispone de **25 segundos** para evaluar y presionar una de las tres compuertas de disposición:

* **[ GO ] — Aprobación Inmediata:**  
  El requerimiento cuenta con certidumbre, reglas de negocio atómicas, criterios de aceptación verificables y cumplimiento con las restricciones arquitectónicas. Se autoriza su ingreso a codificación o despliegue.

* **[ PIVOT ] — Redirección a Aprendizaje y Rediseño:**  
  El requerimiento presenta ambigüedades lógicas, traslapes en tablas DMN, omisión de casos de borde o falta de validación con usuarios clave. Se detiene el paso a código y se envía a refinamiento o taller JAD.

* **[ KILL ] — Cancelación o Bloqueo Tajante:**  
  El requerimiento carece de valor comprobable para el negocio, contradice normativas regulatorias críticas, omite salvaguardas de seguridad/rendimiento de la norma ISO/IEC 25010 o representa prácticas artesanales de "agilismo de etiqueta". Se expulsa del backlog o se bloquea el despliegue.

### 2.3. Algoritmo de Puntuación (Estilo Kahoot Técnico)
* **Puntuación Base por Acierto:** 500 puntos.
* **Bonificación por Velocidad:** Hasta 500 puntos adicionales, calculados proporcionalmente según el tiempo restante:  
  `Puntaje = 500 + Redondeo(500 * (Tiempo_Restante / Tiempo_Total))`
* **Bonificación por Racha Consecutiva:** +50 puntos acumulativos por cada acierto consecutivo sin fallar.
* **Puntaje por Error:** 0 puntos.

Al finalizar las 6 rondas, el sistema genera la tabla de posiciones con el podio de los tres primeros lugares y declara al dictaminador de requerimientos más certero de la sesión.

---

## 3. Banco de Casos de Inspección

### Caso 1: Transferencia Bancaria Exprés y la Inercia del Sprint
* **Eje Temático:** 3.4 Casos Reales en Agilidad (*Shim & Lee, 2026*).
* **Contexto de Negocio:** Aplicación de banca móvil comercial en etapa de Sprint Planning.
* **Historia de Usuario:**  
  *"Como cuentahabiente, deseo transferir fondos a cualquier banco de manera inmediata para evitar demoras de 24 horas."*
* **Condición Técnica Diagnosticada:**  
  El Product Owner presentó la historia sin definir el límite transaccional diario, sin reglas de contingencia si el servicio del banco central no responde en 3 segundos, y sin criterios de aceptación en BDD. Ante la presión de agotar la capacidad planificada del sprint (inercia del sprint), el equipo propone comenzar a codificar los controladores de inmediato.
* **Dilema de Inspección:** ¿Qué disposición corresponde aplicar a esta historia de usuario?
  * Opción A: `[ GO ]` — Admitir a desarrollo para preservar la velocidad y cadencia pactada de la célula ágil.
  * Opción B: `[ PIVOT ]` — Detener el ingreso a codificación y redirigir a sesión de modelado de reglas de negocio antes de comprometer horas del sprint.
  * Opción C: `[ KILL ]` — Eliminar definitivamente la funcionalidad del sistema bancario por considerarla inviable técnicamente.
* **Disposición Canónica:** `[ PIVOT ]`
* **Fundamentación Teórica:**  
  El estudio de Shim & Lee (2026) en *IEEE Access* documenta que el 34.8% de los ítems que los equipos pretenden codificar por inercia rutinaria presentan incertidumbres severas. Ingresar a codificación sin reglas atómicas ni criterios de fallo genera código defectuoso y alto retrabajo. Debe aplicarse la compuerta PIVOT para formalizar las reglas en un catálogo DMN previo a su desarrollo.

---

### Caso 2: Traslape Lógico en Tabla DMN de Cirugía Cardiovascular
* **Eje Temático:** 3.3 Reglas de Negocio en Metodologías Ágiles (*Object Management Group DMN 1.5 & Business Rules Group*).
* **Contexto de Negocio:** Portal hospitalario para dictamen automatizado de cobertura en sala de urgencias.
* **Modelo Propuesto:**  
  Se implementa una tabla de decisión DMN con política de acierto **Unique (U)** con dos reglas activas:
  * Regla 1: Si `Edad > 65`, entonces `Cobertura = 100%`.
  * Regla 2: Si `Exclusión_Cardiología = Verdadero`, entonces `Cobertura = 0%`.
* **Condición Técnica Diagnosticada:**  
  Llega a urgencias un paciente de 70 años cuya póliza registra `Exclusión_Cardiología = Verdadero`.
* **Dilema de Inspección:** ¿Qué comportamiento exhibe el motor de decisiones DMN y cuál es la compuerta adecuada?
  * Opción A: `[ GO ]` — El motor autoriza el 100% porque la Regla 1 se evalúa primero en el orden visual de la tabla.
  * Opción B: `[ PIVOT ]` — El motor lanza una excepción fatal de consistencia por traslape de reglas; debe reestructurarse la lógica DMN antes de codificar.
  * Opción C: `[ KILL ]` — El motor calcula el promedio matemático de ambas reglas y otorga el 50% de cobertura automáticamente.
* **Disposición Canónica:** `[ PIVOT ]`
* **Fundamentación Teórica:**  
  La especificación OMG DMN v1.5 define que la política de acierto *Unique (U)* exige que exactamente una fila coincida con las variables de entrada. Un traslape (dos filas evaluando verdadero a la vez) provoca una falla en tiempo de ejecución. La compuerta PIVOT obliga a los analistas a desambiguar la precedencia lógica (por ejemplo, evaluando la exclusión médica como condición excluyente primaria) antes de llevar la tabla al motor Drools/Camunda.

---

### Caso 3: Omisión Normativa Descubierta en Taller JAD Bancario
* **Eje Temático:** 3.2 Artefactos de la Metodología RAD (*James Martin, 1991*).
* **Contexto de Negocio:** Módulo de otorgamiento automatizado de créditos de nómina en ventanilla.
* **Situación Observada:**  
  Durante la fase de Diseño del Usuario, en una sesión intensiva de Diseño Conjunto de Aplicaciones (JAD), el Facilitador y el equipo SWAT proyectan un prototipo interactivo ejecutable ante funcionarios de sucursal (SMEs). Al operar la pantalla, un funcionario advierte que no se contempla la consulta obligatoria al Buró de Crédito para montos mayores a un salario mínimo (requisito normativo que nadie mencionó en las entrevistas preliminares).
* **Respuesta Técnica:**  
  El equipo SWAT actualiza de inmediato el modelo entidad-relación en la herramienta CASE, conecta la llamada asíncrona en el modelo de procesos y regenera el prototipo en 20 minutos, obteniendo la validación directa del Patrocinador Ejecutivo presente.
* **Dilema de Inspección:** ¿Cuál es la disposición de este requerimiento actualizado dentro de la caja de tiempo (timebox) de 60 días?
  * Opción A: `[ GO ]` — Aprobar a construcción rápida; el prototipo evolutivo resolvió la brecha cognitiva y blindó la especificación operativa.
  * Opción B: `[ PIVOT ]` — Suspender la fase de diseño e iniciar un proyecto de especificación estática SRS de 6 meses bajo norma IEEE 830.
  * Opción C: `[ KILL ]` — Cancelar el requerimiento de consulta al Buró para no consumir minutos adicionales de la sesión JAD.
* **Disposición Canónica:** `[ GO ]`
* **Fundamentación Teórica:**  
  Ilustra el núcleo de la tesis de James Martin (1991) y Toro & Peláez (2016): los usuarios no logran explicitar sus reglas en abstracto; la interacción táctil con el prototipo evolutivo activa la memoria contextual y destapa requerimientos implícitos tempranamente. Al sincronizarse en el repositorio CASE centralizado, avanza legítimamente con compuerta GO a la construcción.

---

### Caso 4: Negligencia de Requerimientos No Funcionales en Pasarela de Pagos
* **Eje Temático:** 3.4 Casos Reales (*Cao & Ramesh, 2008*) e Integración con Calidad de Software (*ISO/IEC 25010:2023*).
* **Contexto de Negocio:** Comercio electrónico de alta concurrencia en periodo promocional.
* **Historia de Usuario:**  
  *"Como comprador, deseo ingresar los datos de mi tarjeta bancaria y completar el pago en un clic."*
* **Condición Técnica Diagnosticada:**  
  En la sesión de demostración del sprint (*Sprint Review*), la interfaz gráfica luce perfecta y procesa compras de prueba con un solo usuario. No obstante, el equipo omitió estipular los requerimientos de eficiencia de desempeño (menos de 500 ms bajo 2,000 transacciones simultáneas) y omitió el cifrado de datos sensibles en tránsito (TLS 1.3) y en reposo (AES-256), argumentando que *"el manifiesto ágil valora software funcionando sobre documentación técnica"*.
* **Dilema de Inspección:** ¿Qué disposición debe aplicar la compuerta de calidad para autorizar la liberación a producción?
  * Opción A: `[ GO ]` — Liberar a producción; la satisfacción visual del cliente en la demostración valida el incremento de software.
  * Opción B: `[ KILL ]` — Descartar permanentemente el canal de pagos en línea y limitar las compras a transferencias manuales.
  * Opción C: `[ PIVOT ]` — Bloquear el paso a producción; los atributos de calidad de ISO/IEC 25010 deben actuar como restricciones obligatorias en la Definición de Terminado.
* **Disposición Canónica:** `[ PIVOT ]` (Bloqueo de compuerta)
* **Fundamentación Teórica:**  
  Cao & Ramesh (2008) demostraron empíricamente en 16 empresas que la negligencia sistemática de los NFRs es la principal patología de los marcos ágiles mal entendidos, generando pasivos masivos de deuda técnica. Bajo el marco integrador propuesto, la seguridad y el desempeño no son negociables: operan como restricciones de primer nivel en la *Definition of Done (DoD)*.

---

### Caso 5: Solicitud de Cambio Verbal por Mensajería y "Agilismo de Etiqueta"
* **Eje Temático:** 3.4 Prácticas de Especificación en Mipymes (*Toro Lazo & Peláez Valencia, 2016*).
* **Contexto de Negocio:** Empresa desarrolladora de software a la medida contratada por terceros.
* **Situación Observada:**  
  A 48 horas de la entrega contractual, el cliente envía un mensaje informal por WhatsApp pidiendo alterar la fórmula de comisiones y multas. El desarrollador modifica directamente un bloque de sentencias condicionales (`if-else`) en el controlador de la vista web. No se redacta criterio de aceptación, no se actualiza el catálogo de reglas ni se programan pruebas automatizadas. El equipo afirma que esto demuestra *"flexibilidad ágil y respuesta ante el cambio"*.
* **Dilema de Inspección:** ¿Qué dictamen emite la disciplina de ingeniería de requerimientos ante este procedimiento?
  * Opción A: `[ GO ]` — Práctica ágil ejemplar; prioriza la respuesta inmediata ante el cambio sobre el seguimiento estricto de un plan.
  * Opción B: `[ KILL ]` — Rechazar y bloquear la alteración directa del código; constituye "agilismo de etiqueta" que anula la trazabilidad y garantiza fallos en producción.
  * Opción C: `[ PIVOT ]` — Desplegar el parche en caliente a producción y comprometerse a documentar el cambio en un procesador de textos al cierre de año.
* **Disposición Canónica:** `[ KILL ]`
* **Fundamentación Teórica:**  
  Toro Lazo & Peláez Valencia (2016) demuestran que la renuncia a la especificación sistemática y el predominio de la informalidad artesanal en Mipymes conducen directamente al 70% de fracaso en proyectos. Incrustar lógica de decisiones dispersa en el código destruye la analizabilidad y la modificabilidad normadas por ISO/IEC 25010.

---

### Caso 6: Trazabilidad Bidireccional en 7 Eslabones con DMN y BDD
* **Eje Temático:** 5. Análisis Integrador, Marco Híbrido y Recomendaciones Técnicas.
* **Contexto de Negocio:** Sistema de facturación corporativa ante una reforma fiscal regulatoria.
* **Situación Observada:**  
  El equipo debe actualizar la tasa preferencial en zona fronteriza. La directiva se extrajo formalmente como regla de derivación (BRG 2000), se modeló en una tabla de decisión DMN 1.5 con política *Unique*, se tradujo en un criterio de aceptación en lenguaje Gherkin (*Dado/Cuando/Entonces*) en la historia de usuario, y cuenta con un escenario automatizado en Cucumber dentro de la canalización de integración continua (CI/CD) que valida la correspondencia con la base de datos.
* **Dilema de Inspección:** ¿Cuál es la disposición de ingeniería para este paquete de requerimientos?
  * Opción A: `[ GO ]` — Aprobar avance a producción con plena certidumbre técnica; cumple íntegramente la cadena de trazabilidad bidireccional de 7 eslabones.
  * Opción B: `[ PIVOT ]` — Detener el incremento porque el desacoplamiento de reglas en DMN impide la autoorganización del equipo Scrum.
  * Opción C: `[ KILL ]` — Cancelar la prueba automatizada porque el Manifiesto Ágil prohíbe el uso de sintaxis formales como Gherkin.
* **Disposición Canónica:** `[ GO ]`
* **Fundamentación Teórica:**  
  Representa el estado del arte propuesto por el equipo: si una auditoría o reforma cambia la regla, se rastrea con precisión la tabla DMN, la historia y la prueba automatizada sin desarmar la arquitectura. Se asegura el cumplimiento de ISO/IEC/IEEE 29148 (especificación verificable y no ambigua) y se mitiga de raíz la deuda de requerimientos.

---

## 4. Guion de Facilitación para el Equipo Expositor (Minutos 27:00 a 32:00)

* **Astrid (Apertura de la Dinámica — 0:45 min):**  
  > *"Compañeros y profesora: para consolidar lo analizado y comprobar que la ingeniería de requerimientos no es teoría abstracta sino criterio de decisión profesional, abrimos en este momento nuestro protocolo interactivo de inspección de compuertas ágiles.  
  > Por favor, escaneen el código QR proyectado en pantalla o ingresen desde su navegador a la dirección IP indicada. Ingresen su nombre o alias para registrarse en la sala."*

* **David (Explicación de Mecánica — 0:30 min):**  
  > *"Cada uno de ustedes asumirá el rol de un revisor técnico. En pantalla verán 6 situaciones de diseño. Tendrán 25 segundos por caso para dictaminar: GO si pasa directo a codificación, PIVOT si presenta huecos en sus reglas y debe volver a refinamiento, o KILL si viola la arquitectura de calidad y debe ser cancelado. La rapidez y la exactitud suman puntos para el podio final."*

* **Leonardo (Conducción de Casos DMN y Reglas — 2:00 min):**  
  *Modera el paso de los Casos 1, 2 y 3. Al cerrar la votación de cada uno, resalta en 15 segundos la clave técnica:*
  > *"Observen el Caso 2: más del 40% votó GO creyendo que la primera regla mandaba. Sin embargo, en DMN con política Unique, el motor no adivina: si dos reglas coinciden, el sistema arroja una excepción fatal. Por eso la decisión correcta era PIVOT."*

* **Angel (Conducción de Casos Reales y Cierre del Podio — 2:00 min):**  
  *Modera los Casos 4, 5 y 6, enfatizando la advertencia contra el agilismo de etiqueta:*
  > *"El caso del WhatsApp no es agilidad; es la causa documentada por Toro y Peláez del 70% de fracasos en desarrollo. Cerramos la última compuerta y veamos la tabla final de posiciones."*  
  *(Proyecta el podio con el 1.º, 2.º y 3.º lugar y entrega el reconocimiento al ganador).*

---

## 5. Tabla de Exportación Directa para Plataformas en Línea (Kahoot / Quizizz)

Si el equipo opta por importar la dinámica en una plataforma cloud como Kahoot o Quizizz en lugar del servidor local, a continuación se proporciona la matriz de reactivos con el formato estándar requerido:

| # | Pregunta / Título del Caso | Opción 1 (Verde) | Opción 2 (Amarillo) | Opción 3 (Rojo) | Opción 4 (Azul) | Correcta | Tiempo |
|---|---|---|---|---|---|---|---|
| 1 | Historia bancaria sin límite transaccional ni manejo de fallos para cumplir la velocidad del sprint (Shim & Lee, 2026): | GO: Iniciar desarrollo para mantener la cadencia del sprint | PIVOT: Redirigir a refinamiento y modelado de reglas | KILL: Cancelar la transferencia bancaria por inviable | GO: Esperar que el programador defina las reglas sobre la marcha | Opción 2 (PIVOT) | 30 s |
| 2 | Tabla DMN 1.5 con política UNIQUE: Regla 1 (Edad > 65 -> 100%) y Regla 2 (Exclusión -> 0%). Llega paciente de 70 años con exclusión: | GO: Otorga 100% por orden visual de filas | PIVOT: Falla el motor por traslape; requiere desambiguar | KILL: El motor asigna el promedio (50%) | GO: El motor ignora las exclusiones en mayores de 65 | Opción 2 (PIVOT) | 30 s |
| 3 | En sesión JAD, el usuario detecta omisión de Buró de Crédito en el prototipo interactivo; se ajusta el modelo CASE en 20 min (Martin, 1991): | GO: Requisito implícito validado en prototipo evolutivo | PIVOT: Detener el proyecto y redactar un SRS de 6 meses | KILL: Descartar el Buró para no alterar la sesión | PIVOT: Multar al analista por no preverlo en la entrevista | Opción 1 (GO) | 30 s |
| 4 | Historia de pagos web aprobada visualmente, pero omite cifrado y pruebas de latencia bajo concurrencia (Cao & Ramesh; ISO 25010): | GO: Liberar a producción; la interfaz satisface al cliente | KILL: Cerrar definitivamente el módulo de compras | PIVOT: Bloquear paso a producción por violar la Definition of Done | GO: Postergar la seguridad a una versión futura no prioritaria | Opción 3 (PIVOT) | 30 s |
| 5 | Solicitud de cambio de tasas por WhatsApp a 48 h de entrega, codificada en if-else sin actas ni pruebas BDD (Toro & Peláez, 2016): | GO: Máxima agilidad y adaptabilidad ante el cambio | KILL: Agilismo de etiqueta que destruye la mantenibilidad | PIVOT: Pasar a producción y documentar en Word después | GO: Buena práctica si el programador tiene experiencia | Opción 2 (KILL) | 30 s |
| 6 | Regla fiscal en catálogo BRG, tabla DMN 1.5 Unique, criterios BDD (Gherkin) y pruebas automáticas en CI/CD: | GO: Trazabilidad bidireccional en 7 eslabones completada | PIVOT: Detener porque DMN vulnera la autoorganización | KILL: Eliminar BDD por ser demasiado estricto para ágil | PIVOT: Rechazar por exceso de rigor metodológico | Opción 1 (GO) | 30 s |

---

## 6. Instrucciones de Ejecución y Despliegue en la Nube

### Opción A: Despliegue Gratuito en la Nube con Render.com (Recomendado para el Aula)
Permite que todos los alumnos se conecten con sus datos móviles (4G/5G) o cualquier Wi-Fi sin restricciones de red local:

1. **Subir a GitHub:**
   Crear un repositorio en GitHub y subir el contenido de `dinamica-interactiva`:
   ```bash
   cd C:\Users\adanl\UPIICSA\IngenieriaDeRequerimentos\dinamica-interactiva
   git init
   git add .
   git commit -m "Dinamica Requerimientos Equipo 6"
   git branch -M main
   git remote add origin https://github.com/TU_USUARIO/TU_REPO.git
   git push -u origin main
   ```
2. **Crear el Web Service en Render:**
   * Entrar a [render.com](https://render.com) e iniciar sesión con GitHub.
   * Clic en **New +** > **Web Service**.
   * Seleccionar el repositorio.
   * Configurar:
     * **Runtime:** `Node`
     * **Build Command:** `npm install`
     * **Start Command:** `node server.js`
     * **Instance Type:** `Free`
   * Clic en **Deploy Web Service**.
3. **Proyección en el Aula:**
   * Abrir en la laptop la URL asignada: `https://tu-servicio.onrender.com/host.html`.
   * El sistema generará el código QR apuntando a esa URL pública.
   * *Recomendación:* Abrir la URL 5 minutos antes de la exposición para activar el contenedor del plan gratuito.

### Opción B: Ejecución Local en el Aula (Sin Nube)
1. **Requisitos:** Node.js instalado en la laptop del expositor.
2. **Puesta en Marcha:**
   * Hacer doble clic sobre `iniciar_dinamica.bat`.
   * En el proyector se abrirá automáticamente `http://localhost:3000/host.html` mostrando la IP y el código QR local.
   * Los alumnos conectan sus teléfonos a la misma red Wi-Fi o punto de acceso móvil.
