# drugstore-site
My solution for a job application

## Ejecutar el proyecto usando Docker

1. Clonar el repositorio
2. Abrir una consola y situarse en el directorio raiz del proyecto
3. Crear la imagen de docker con el siguiente comando: 
```docker build -t drugstore-site .```

4. Subir un docker container a partir de la imagen creada:
```docker run -d -p 8000:8000 drugstore-site```

5. En el browser cargar la url: http://localhost:8000

6. Para bajar el proyecto, buscar el id del container con imagen 'drugstore-site'

7. Detener el container:
```docker stop id_container```

## Ejecutar el proyecto usando Nodejs

1. Clonar el repositorio
2. Abrir una consola y situarse en el directorio raiz del proyecto
3. Cambiarse al directorio src:
```cd src```

3. Setear la versión correcta de npm (requiere tener Node Version Manager -> nvm instalado)
```nvm use```

3. Instalar las dependencias:
```npm install```


4. Subir el proyecto con node:
```node server.js```

6. En el browser cargar la url: http://localhost:8000

## Api endpoints

Los endpoints de la API son los siguientes:

- http://localhost:8000/api/communes

Descripción: Obtiene las comunas de la región metropolitana

Método: GET

Parámetros: No tiene


- http://localhost:8000/api/stores

Descripción: Obtiene las farmacias de turno de una comuna

Método: GET

Parámetros:
- communeId: id de la comuna
- name: string que puede estar contenido en el nombre de la farmacia
