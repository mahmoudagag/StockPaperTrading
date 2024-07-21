### How to Start
Run this following lines in the root directory: <br />
To get the necessary packages 
``` 
go get . 
```
To run app
``` 
go run .
```
To build with docker 

```
docker build -t stock-simulator:latest .
```

To run docker container

```
docker run -d --restart=always -p 8080:80 image_name:version
```

To run docker container

```
docker-compose up
```