# Herramienta web para la revisión ligera de textos

Este trabajo busca ofrecer una herramienta que evite el siguiente escenario:

1. Un conocido, compañero de trabajo, o similar nos pide consejo acerca de un texto. Puede ser un correo importante, un abstract o párrafo concreto que añadir a un artículo científico o documento, etcétera.

2. Procedemos a revisar el texto. En este proceso, puede que alteremos alguna parte del mismo, con la esperanza de mejorarlo.

3. Devolvemos el texto de nuevo a la persona que nos lo envió. Entonces, esta persona nos pregunta dónde hemos cambiado el texto, ya que puede que algunas de nuestras modificaciones no mantengan el mensaje original, sobre todo si pertenecemos a diferentes dominios, si no estamos familiarizados con el contexto, etcétera. En este punto, pueden darse diferentes posibilidades:
    - No nos acordamos de qué hemos cambiado, entonces la persona debe (tediosamente) leer los dos textos a la vez en busca de estos cambios.

    - Nos acordamos de todos los cambios (o eso creemos), y se los vamos enumerando (tediosamente) para que los corrija.

    - Ya nos hemos encontrado en cualquiera de los puntos anteriores, y para evitarlos, le mandamos el texto de vuelta a la persona modificado con un sistema que admite control de cambios, como pueden ser Microsoft Word o Google Docs. El control de cambios permite a la persona original ver las actualizaciones realizadas sobre el texto original, y aceptarlas, descartarlas, o re-modificarlas según le convenga.

El objetivo de este proyecto es aligerar el esfuerzo necesario para llevar a cabo la tercera posibilidad. Poniendo como ejemplo Google Docs, los pasos necesarios para revisar un texto serían:

1. Abrir Google Docs y crear un documento en blanco.
2. Pegar el texto.
3. Buscar dónde se encuentra la opción de activar el control de cambios. Dependiendo de la frecuencia con la que hagamos estas revisiones, esta búsqueda podría no existir (frecuencia alta de revisiones) o ser necesaria todas y cada una de las veces (frecuencia baja de revisiones).
4. Revisar el texto con el control de cambios de por medio, que a veces limita la usabilidad del editor.
5. Compartir un enlace al texto actualizado, asegurándonos de que tiene permisos de edición.

Se plantea el desarrollo de la herramienta web "QuickEd" (sugerencia de nombre a determinar por el estudiante), cuyo objetivo es simplificar este proceso al máximo. Para llevar a cabo este proyecto se utilizarán herramientas web, incluyendo un editor como Ace (https://ace.c9.io/) o Monaco (https://microsoft.github.io/monaco-editor/). Además del desarrollo, el proyecto incluirá el análisis y la selección de las herramientas y librerías más adecuadas para su implementación.

Existen herramientas similares a la deseada, pero que no cumplen todos los pasos descritos. Por ejemplo, Text Compare (https://www.webutils.app/text-diff) permite comparar dos textos, pero lo hace de manera bastante primitiva, y no incluye ninguna facilidad de control de cambios, ni capacidades de compartir el texto actualizado.

Se estudiará también la posibilidad de desplegar dicha herramienta para su uso de forma pública. Para este despliegue, se plantea como posibilidad el uso del alojamiento gratuito de GitHub Pages.
