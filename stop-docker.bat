@echo off
echo Stopping MySQL and phpMyAdmin containers...
docker-compose stop db phpmyadmin
echo Done!