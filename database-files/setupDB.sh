#!/bin/bash

# mysql -u root -p
# mysql -u testuser -p

user_name="ais_user"
pass="zebra"

mysql -u root -p -e "
    CREATE USER IF NOT EXISTS '$user_name'@'%' IDENTIFIED BY '$pass'; 
    GRANT ALL PRIVILEGES ON *.* TO '$user_name'@'%';
    ALTER USER '$user_name'@'%' IDENTIFIED WITH mysql_native_password BY '$pass';
"

mysql -u $user_name -p$pass < CreateAIS.sql
echo "Created databse AIS"

# mysql -u $user_name -p$pass -D AIS -e "select * from Users"
