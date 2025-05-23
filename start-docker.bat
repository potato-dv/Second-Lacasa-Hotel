@echo off
echo Starting MySQL and phpMyAdmin containers...
docker-compose up -d db phpmyadmin
echo Done!
start http://localhost:8081
