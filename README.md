# API REST

Una API REST de Node Express.js con TypeScript y uso de una Base de Datos en Mongodb

## Instalar dependencias
```bash
npm install
```
Para las variables de entorno hay un archivo en el proyecto llamado ".example.env" que contiene los nombre de las variables de entornos necesarias. Las variables: CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET solo serán necesarias si se utiliza el servicio en de Cloudinary que es un servidor en la nube para la gestión y almacenamiento de imágenes, por defecto la API REST esta configurada para guardar las imágenes de manera local en una carpeta llamada uploads en la raíz del API.

### Ejemplos de solicitudes y respuestas.
En el proyecto se encuentra un archivo llamado "E-Commerce.postman_collection.json" que es una colección de la herramienta Postman con todos los Endpoints de la API estructurados. Para hacer uso de este archivo solo hay que importarlo en la herramienta Postman.


### CLOUDINARY
Para utilizar la API con el servicio de Cloudinary una vez asignado los respectivos valores a las variables de entorno; en el archivo "app.ts" des comentar la línea 3 y desde la 6 hasta la 10. Ya luego en el archivo "productController.ts" cambiar toda la línea 5 por la siguiente:
```bash
import { deletePicture, uploadPicture } from "../services/uploadPictureCloudinary";
```
