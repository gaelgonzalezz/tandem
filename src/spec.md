#Contexto General:
Una ONG que promueve el aprendizaje de idiomas quiere lanzar Tándem, una plataforma donde personas
de distintos países practican idiomas entre sí. La idea es el intercambio: alguien que habla español y quiere
aprender alemán conversa con alguien que habla alemán y quiere aprender español, y cada uno ayuda al otro. La plataforma completa contempla, entre otras cosas, sesiones de videollamada agendadas, tutores pagos con reservas y cobros, insignias y rachas de práctica, moderación automática de contenido y notificaciones al celular. Nada de eso entra en este parcial. El parcial se concentra en dos servicios: el que sabe quién es cada persona y qué quiere, y el que le permite conversar con otras. El segundo no puede funcionar sin consultar al primero.

#Primer servicio (no codear, ya está hecho):
Es el servicio que sabe quién es cada persona, qué idiomas maneja y con quién acepta hablar. 
##Personas
De cada persona se registra nombre, apellido, un alias que la identifica públicamente, email y país de
residencia. El alias no puede repetirse. Una persona puede estar activa o suspendida; una persona
suspendida no puede iniciar ni recibir contactos de nadie.
##Idiomas
La plataforma trabaja con un catálogo de idiomas (por ejemplo español, alemán, inglés, portugués, italiano),
identificados por un código como es o de . El catálogo lo carga el equipo al arrancar el servicio; no hace falta poder modificarlo.
Cada persona declara los idiomas que habla y los que está aprendiendo, con su nivel (A1, A2, B1, B2, C1,
C2). 
##Reglas:
No puede estar aprendiendo un idioma que declara que habla.
Puede estar aprendiendo como máximo 3 idiomas a la vez. Para sumar un cuarto tiene que dejar uno.
Tiene que hablar al menos un idioma.
Solo se aceptan idiomas del catálogo.
Preferencias
Cada persona define:
Quién puede iniciarle una conversación: cualquiera, solo personas compatibles o nadie.
Cuántas conversaciones activas acepta tener al mismo tiempo (entre 1 y 10; por defecto 5).
Si tiene activado el modo no molestar. Con el modo activo nadie puede iniciarle una conversación
nueva, pero las que ya tiene siguen funcionando.
Bloqueos
Una persona puede bloquear a otra y desbloquearla después. El bloqueo funciona en los dos sentidos: si A
bloqueó a B, ninguno de los dos puede contactar al otro.
Compatibilidad
Dos personas son compatibles en un idioma cuando una lo habla y la otra lo está aprendiendo. Son
un tándem cuando además ocurre lo mismo en sentido inverso con otro idioma (A habla español y
aprende alemán; B habla alemán y aprende español).

Se ocupa de:
1. Registrar personas, consultarlas, modificar sus datos y suspenderlas o reactivarlas.
2. Administrar los idiomas que una persona habla y aprende, respetando las reglas anteriores.
3. Consultar y modificar las preferencias de una persona.
4. Bloquear y desbloquear personas, y consultar a quién bloqueó alguien.
5. Dada una persona, sugerirle otras personas activas con las que sea compatible, mostrando primero las
que forman tándem. Nunca se sugieren personas bloqueadas ni que no acepten contactos.
6. Responder si una persona puede contactar a otra en un idioma determinado, y si no puede, por qué (inexistente, suspendida, bloqueo, preferencia, no molestar, idioma no compatible). Esta funcionalidad es la que va a usar el Servicio II.

#Servicio 2 (tu trabajo):
Es el servicio donde las personas conversan de a dos para practicar. No guarda datos de personas: de
cada participante conoce solo su identificador, y todo lo que necesite saber sobre ellas se lo pregunta al
Servicio I en el momento.

##Conversaciones
Una conversación es siempre entre dos personas y tiene un idioma de práctica. Atraviesa estos estados:
pendiente (una persona la inició y la otra todavía no respondió), activa (la otra aceptó), rechazada y
cerrada.
Para iniciar una conversación, el iniciador tiene que poder contactar al destinatario en ese idioma
según el Servicio I.
Al iniciarla se envía un único mensaje de presentación. Mientras esté pendiente, el iniciador no puede
mandar más mensajes.
Solo el destinatario puede aceptarla o rechazarla.
No puede haber dos conversaciones pendientes o activas entre las mismas dos personas en el mismo
idioma.
Nadie puede superar la cantidad de conversaciones activas que fijó en sus preferencias. Esto se
controla al aceptar, para las dos personas.
Cualquiera de los dos participantes puede cerrar una conversación activa. Una conversación cerrada o
rechazada no admite ninguna operación más.

##Mensajes
Cada mensaje tiene autor, texto, fecha y hora de envío, y si el otro participante ya lo leyó.
Solo los participantes pueden enviar y leer mensajes de una conversación.
Si entre el inicio y ahora uno bloqueó al otro o alguno fue suspendido, no se pueden enviar más
mensajes. Esto se verifica en cada envío, no solo al iniciar.
Una persona puede marcar como leídos los mensajes que recibió, y saber cuántos mensajes sin leer
tiene en total y por conversación.

##Correcciones
Es lo que distingue a Tándem de un chat común. Un participante puede corregir un mensaje del otro
indicando el texto corregido y, si quiere, un comentario.

No se puede corregir un mensaje propio.
Solo puede corregir quien habla el idioma de la conversación (dato del Servicio I).
Cada mensaje admite una sola corrección.
Al consultar los mensajes de una conversación, cada uno se muestra con su corrección si la tiene.
Lo que el servicio tiene que poder hacer
1. Iniciar una conversación con su mensaje de presentación; aceptarla, rechazarla o cerrarla.
2. Listar las conversaciones de una persona, filtrando por estado.
3. Enviar mensajes y consultar los mensajes de una conversación en orden cronológico.
4. Marcar mensajes como leídos y consultar los no leídos.
5. Corregir mensajes.
Si el Servicio I no responde
El Servicio II no puede asumir que la operación está permitida: la rechaza con un error que deje claro
que el problema es la dependencia y no el pedido del cliente. Cómo resolverlo tiene que estar en el
spec.

#Restricciones técnicas
NestJS + TypeScript. Un proyecto independiente por servicio, cada uno con su package.json .
Servicio I en el puerto 3001, Servicio II en el 3002.
Persistencia en memoria con arrays estáticos dentro de los services (por ejemplo private static
personas: Persona[] = [] ). Sin base de datos, ni archivos, ni librerías de persistencia. Los ids los
genera el servidor con un contador incremental.
Comunicación entre servicios por HTTP. El Servicio II llama al I como lo haría cualquier cliente
externo ( fetch o HttpModule ). No se comparte código ni se importan clases de un proyecto en el
otro.
Separación de responsabilidades como en Libros Circulares: entidades, DTOs, controladores sin
lógica, reglas de negocio en los services.
Errores con el código HTTP que corresponda: 404 si no existe, 400 si el pedido viola una regla, 409
si hay conflicto de estado, 503 si falla la dependencia. Nunca un 200 con un mensaje de error adentro.
Para precargar el catálogo de idiomas y algunas personas de prueba se puede inicializar el array con
datos.





