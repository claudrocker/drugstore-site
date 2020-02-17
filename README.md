# drugstore-site
My solution for a job application

## Instalación del proyecto

1. Clonar el repositorio
2. Crear la imagen de docker con el siguiente comando: 
```docker build -t drugstore-site .```

3. Subir un docker container a partir de la imagen creada:
```docker run -p 8000:8000 drugstore-site````

4. En el browser cargar la url: http://localhost:8000
