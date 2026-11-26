# Muelle · Next.js con Docker

Muelle es una bitácora de carga hecha con Next.js y TypeScript. Su panel **Estado del servidor** consulta una ruta de la aplicación y muestra el entorno, la versión de Node.js y la hora UTC de la respuesta. Sirve para comprobar desde el navegador que el servidor de producción está atendiendo solicitudes.

## Ejecutar 

Abrí Docker Desktop con el motor de contenedores Linux en ejecución.Abrí PowerShell en la carpeta que contiene `Dockerfile` y `package.json`. Solo necesitás Docker para este flujo.

**1. Construir la imagen.** El punto final indica que Docker debe usar la carpeta actual como contexto. La primera compilación requiere conexión a Internet.

```powershell
docker build -t muelle-next:1.0 .
```

**2. Iniciar el contenedor.** El puerto 3000 de tu computadora se conecta al puerto 3000 del contenedor.

```powershell
docker run -d --name muelle-web -p 127.0.0.1:3000:3000 muelle-next:1.0
docker logs muelle-web
```

**3. Verificar el resultado.** Abrí [http://localhost:3000](http://localhost:3000) y presioná **Verificar conexión**. Debe aparecer **Servidor en línea**, con el entorno `production`, la versión de Node.js y la hora de la consulta. Si repetís la consulta unos segundos después, la hora debe actualizarse.

También podés comprobarlo en PowerShell una vez que el servidor esté listo.

```powershell
(Invoke-WebRequest -UseBasicParsing http://localhost:3000).StatusCode
Invoke-RestMethod http://localhost:3000/api/estado
```

La primera instrucción debe devolver **200**. La segunda muestra los campos `estado` (`ok`), `entorno` (`production`), `node` y `fecha`.

**4. Detener la aplicación.**

```powershell
docker stop muelle-web
```

Para volver a iniciarla, usá `docker start muelle-web`. Para reemplazarla tras cambiar el código, detené el contenedor, ejecutá `docker rm muelle-web` y repetí los pasos 1 y 2.

Si el puerto 3000 está ocupado, cambiá la publicación a `-p 127.0.0.1:3001:3000` en el paso 2. En ese caso, usá `http://localhost:3001` para las comprobaciones.

## Cómo se construye la imagen

| Etapa          | Función                                                                                                                                                 |
| -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `base`         | Usa la imagen oficial `node:24-alpine` y define `/app` como directorio de trabajo. Node.js 24 cumple el mínimo de Node.js 20.9 que requiere Next.js 16. |
| `dependencias` | Copia los manifiestos e instala con `npm ci` las versiones registradas en `package-lock.json`. Docker puede reutilizar esta capa al editar la interfaz. |
| `compilacion`  | Copia el código, ejecuta `npm run build` (que invoca `next build`) y elimina las dependencias de desarrollo.                                            |
| `produccion`   | Copia la aplicación compilada y sus dependencias de ejecución. Arranca `next start` como usuario `node` y escucha en el puerto 3000.                    |

El archivo `.dockerignore` excluye las dependencias locales, compilaciones anteriores, archivos `.env`, registros y temporales del contexto de Docker.

## Resultado de la verificación

Se construyó la imagen y se inició el contenedor en Linux con Docker Engine 28.5.2. Para la instalación se usó una copia local de los paquetes de npm, verificados contra el archivo de bloqueo. El comando de construcción de esta guía usa el registro público por defecto.

| Comprobación | Resultado observado |
| --- | --- |
| Construcción | Imagen `muelle-next:1.0` creada correctamente. |
| Página principal | `GET /` devolvió HTTP 200 por el puerto publicado. |
| Diagnóstico | `GET /api/estado` devolvió HTTP 200, estado `ok`, entorno `production` y Node.js `24.22.3`. |
| Usuario de ejecución | El proceso se ejecutó como `node` (UID 1000). |

