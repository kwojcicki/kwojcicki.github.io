---
layout:     post
title:      "Setting up an OpenLDAP Server"
subtitle:   "Explaining how to set up a local test OpenLDAP Server with TLS"
date:       2018-05-21 17:00:00
author:     "Krystian Wojcicki"
header-img: "img/posts/jekyll-bg.jpg"
comments: true
tags: [ OpenLDAP ]
---

# Setting Up OpenLDAP

## Installing OpenLDAP
https://help.ubuntu.com/lts/serverguide/openldap-server.html and https://www.linuxbabe.com/ubuntu/install-configure-openldap-server-ubuntu-16-04

OpenLDAP installation is much simpler than AD and can be easily in a terminal.

First:
* sudo apt install slapd ldap-utils
* sudo dpkg-reconfigure slapd
* Omit LDAP server configuration: No
* DNS domain name can be anything you want will be using company.local.test.linux for this
* Organization name should be the same as the DNS domain name
* Select MDB for the database backend
* Set the password however you want in this example we will be using password
* Don't remove the database when slapd is purged
* Yes move old database
* No dont allow LDAPv2 protocol

*** Warning ***
If a different backend database is picked (ie not MDB) the following ldif files will need to be changed to match the database selected



For the following sections for any ldapadd or ldapmodify command the expect output is
``` adding new entry "fully qualified domain name of what you were adding"```
with no error messages following it

for example
```
adding new entry "cn=admin,ou=groups,dc=company,dc=local,dc=test,dc=linux" 
```


## Adding password policy


For all these commands replace -w password with -w [ admin password ] 

### Enable ppolicy overlay

sudo ldapadd -Y EXTERNAL -H ldapi:/// -f /etc/ldap/schema/ppolicy.ldif

Create a Policies myoupolicy.ldif OrganizationalUnit

```
dn: ou=Policies,dc=company,dc=local,dc=test,dc=linux
objectClass: top
objectClass: organizationalUnit
ou: Policies
description: My Organization policies come here
```

Add myoupolicy.ldif

sudo ldapadd -D cn=admin,dc=company,dc=local,dc=test,dc=linux -w password -f myoupolicy.ldif

Create file ppmodule.ldif to load the pp module

```
dn: cn=module{0},cn=config
changetype: modify
add: olcModuleLoad
olcModuleLoad: ppolicy
```

load the module ppmodule.ldif

sudo ldapadd -Y EXTERNAL -H ldapi:/// -f ppmodule.ldif

Prepare for Overlay Create file ppolicyoverlay.ldif

```
dn: olcOverlay={0}ppolicy,olcDatabase={1}mdb,cn=config
objectClass: olcOverlayConfig
objectClass: olcPPolicyConfig
olcOverlay: {0}ppolicy
olcPPolicyDefault: cn=MyOrgPPolicy,ou=Policies,dc=company,dc=local,dc=test,dc=linux
```

Add ppolicyoverlay.ldif using ldapadd command

sudo ldapadd -Y EXTERNAL -H ldapi:/// -f ppolicyoverlay.ldif

Create passwordpolicy.ldif for MyOrganization

```
dn: cn=MyOrgPPolicy,ou=Policies,dc=company,dc=local,dc=test,dc=linux
cn: MyOrgPPolicy
objectClass: pwdPolicy
objectClass: device
objectClass: top
pwdAttribute: userPassword
pwdMaxAge: 3024000
pwdExpireWarning: 1814400
pwdInHistory: 4
pwdCheckQuality: 1
pwdMinLength: 9
pwdMaxFailure: 4
pwdLockout: TRUE
pwdLockoutDuration: 600
pwdGraceAuthNLimit: 0
pwdFailureCountInterval: 0
pwdMustChange: TRUE
pwdAllowUserChange: TRUE
pwdSafeModify: FALSE
```

Add passwordpolicy.ldif in LDAP

sudo ldapadd -D cn=admin,dc=company,dc=local,dc=test,dc=linux -w password -f passwordpolicy.ldif


Verify the configuration

sudo ldapsearch -Y EXTERNAL -H ldapi:/// -b olcDatabase={1}mdb,cn=config

The output of the command should contain something along the lines of

```
# {3}ppolicy, {1}mdn, config
objectClass: olcOverlayConfig
objectClass: olcPPolicyConfig
olcOverlay: {3}ppolicy
olcPPolicyDefault: cn=MyOrgPPolicy,ou=Policies,dc=company,dc=local,dc=test,dc=linux
```

## Setting up TLS for OpenLDAP
Again using https://help.ubuntu.com/lts/serverguide/openldap-server.html#openldap-tls

sudo apt install gnutls-bin ssl-cert

sudo sh -c "certtool --generate-privkey > /etc/ssl/private/cakey.pem"

Create the template/file /etc/ssl/ca.info to define the CA:

```
cn = My Cool Company
ca
cert_signing_key
```

Run the following commands to create the CA

sudo certtool --generate-self-signed \
--load-privkey /etc/ssl/private/cakey.pem \ 
--template /etc/ssl/ca.info \
--outfile /etc/ssl/certs/cacert.pem

sudo certtool --generate-privkey \
--bits 1024 \
--outfile /etc/ssl/private/ldap01_slapd_key.pem

Create the /etc/ssl/ldap01.info info file containing where ip_address is replaced with the ip of your local linux:

organization = My Cool Company
cn = company.local.test.linux
tls_www_server
encryption_key
signing_key
expiration_days = 3650

ip_address="172.20.127.3"

Next we will create the server key and cert

sudo certtool --generate-certificate \
--load-privkey /etc/ssl/private/ldap01_slapd_key.pem \
--load-ca-certificate /etc/ssl/certs/cacert.pem \
--load-ca-privkey /etc/ssl/private/cakey.pem \
--template /etc/ssl/ldap01.info \
--outfile /etc/ssl/certs/ldap01_slapd_cert.pem

sudo chgrp openldap /etc/ssl/private/ldap01_slapd_key.pem
sudo chmod 0640 /etc/ssl/private/ldap01_slapd_key.pem
sudo gpasswd -a openldap ssl-cert

sudo systemctl restart slapd.service



Create the file certinfo.ldif with the following contents

dn: cn=config
replace: olcTLSCACertificateFile
olcTLSCACertificateFile: /etc/ssl/certs/cacert.pem
-
replace: olcTLSCertificateFile
olcTLSCertificateFile: /etc/ssl/certs/ldap01_slapd_cert.pem
-
replace: olcTLSCertificateKeyFile
olcTLSCertificateKeyFile: /etc/ssl/private/ldap01_slapd_key.pem


Use the ldapmodify command to tell slapd about our TLS work via the slapd-config database:

sudo ldapmodify -Y EXTERNAL -H ldapi:/// -f certinfo.ldif

## Visualising OpenLDAP 
Visualising the LDAP server can be useful as well. PhpLDAPadmin can help us with that (similar to phpmyadmin except for LDAP) Using https://www.linuxbabe.com/ubuntu/install-configure-openldap-server-ubuntu-16-04

sudo apt install phpldapadmin

sudo vim /etc/apache2/ports.conf

Replace Listen 80 to Listen 81 so that we can run the solution and the phpldapadmin page at the same time. Restart apache to put the changes into effect

sudo systemctl restart apache2.service

Next we will configure phpldapadmin

sudo vim /etc/phpldapadmin/config.php

Replace

$servers→setValue('server','base',array('dc=example,dc=com'));

with

$servers→setValue('server','base',array('dc=company,dc=local,dc=test,dc=linux'));

If TLS was not configured or certificates are not installed uncomment the following line

// $servers→setValue('server','tls',false);

Save the file and restart apache again 

next go to localhost:81/phpldapadmin or your_local_ip_address:81/phpldapadmin and log in

PhpLDAPadmin uses php7.0 ensure you dont have two conflicting versions of php by doing

locate bin/php

To get rid of other php versions do (replace php5 with whatever extra versions you have installed)

sudo apt-get purge 'php5*' 
To add or remove users using phpldapadmin is quite simple http://www.techrepublic.com/article/how-to-populate-an-ldap-server-with-users-and-groups-via-phpldapadmin/

## GUI utilisation

For the following sections adding sample users and adding sample groups can be done using this tool instead of the command line.

Enabling memberOf and adding readonly admin user should be doing using CLI

However the order in which we do things must stay the same.

## Adding sample users
Create a file called add_content.ldif with the following content

You will need to change the dc part of the domain name to match what was specified during installation.

```
dn: cn=Users,dc=company,dc=local,dc=test,dc=linux
objectClass: posixGroup
cn: Users
gidnumber: 500

dn: ou=Groups,dc=company,dc=local,dc=test,dc=linux
objectClass: organizationalUnit
ou: Groups

dn: cn=adminuser,cn=Users,dc=company,dc=local,dc=test,dc=linux
cn:  adminuser
gidnumber: 500
homedirectory: /home/users/adminuser
loginshell: /bin/sh
objectclass: inetOrgPerson
objectclass: posixAccount
objectclass: top
sn: adminuser
uid: adminuser
uidnumber: 1000
userPassword: {MD5}X03MO1qnZdYdgyfeuILPmQ==

dn: cn=regularuser,cn=Users,dc=company,dc=local,dc=test,dc=linux
cn:  regularuser
gidnumber: 500
homedirectory: /home/users/regularuser
loginshell: /bin/sh
objectclass: inetOrgPerson
objectclass: posixAccount
objectclass: top
sn: regularuser
uid: regularuser
uidnumber: 1001
userPassword: {MD5}X03MO1qnZdYdgyfeuILPmQ==
```

Password for both of the users is ```password``` if a different password is required use the following command and replace userPassword in the ldif file

slappasswd -h {MD5} -s password

Next we will add it to the OpenLDAP server

sudo ldapadd -x -D cn=admin,dc=company,dc=local,dc=test,dc=linux -w password -f add_content.ldif

Adding sample readonly admin user
https://serverfault.com/questions/120499/ldap-slapd-creating-users-with-access-to-specific-trees

Create a file called read_only.ldif with the following content

```
dn: ou=Readonly,dc=company,dc=local,dc=test,dc=linux
objectClass: organizationalUnit
ou: Groups
dn: cn=postfix,ou=Readonly,dc=company,dc=local,dc=test,dc=linux
cn: postfix
objectClass: simpleSecurityObject
objectClass: organizationalRole
userPassword: {SSHA}n+aYhO/TOitWkyMp9v/fe5ndtOhY0/3U
```

This last line is a hash of the password you want to use, generated via the slappasswd utility:

sudo slappasswd -s secret
{SSHA}n+aYhO/TOitWkyMp9v/fe5ndtOhY0/3U

Next we will add it to the OpenLDAP server

sudo ldapadd -x -D cn=admin,dc=company,dc=local,dc=test,dc=linux -w password -f read_only.ldif

Once this is done, add some ACLs to your /usr/share/slapd/slapd.conf that look something like this:

access to dn.sub="ou=Users,dc=company,dc=local,dc=test,dc=linux"

by dn.exact="cn=postfix,ou=Readonly,dc=company,dc=local,dc=test,dc=linux" read

by dn="@ADMIN@" write

by * read

Enabling memberOf openldap functionality
https://help.marklogic.com/knowledgebase/article/View/457/0/using-openldap-for-authorising-marklogic-security-roles

Create a ldif file with the following contents
memberOf.ldif

```
dn: cn=module,cn=config
cn: module
objectClass: olcModuleList
objectclass: top
olcModuleLoad: memberof.la
olcModulePath: /usr/lib/ldap

dn: olcOverlay=memberof,olcDatabase={1}mdb,cn=config
objectclass: olcconfig
objectclass: olcMemberOf
objectclass: olcoverlayconfig
objectclass: top
olcoverlay: memberof
```

For the above file olcModulePath should be the location of memberof.la to find this location

sudo find / -name "memberof.la"

Next enable member of overlay

sudo ldapadd -Q -Y EXTERNAL -H ldapi:/// -f memberOf.ldif

## Adding sample groups
Create createGroup.ldif file with the following contents which will create a group called admin and regular then add the already existing account cn=admin,dc=company,dc=local,dc=test,dc=linux to the admin group and then add  cn=regularuser,cn=Users,dc=company,dc=local,dc=test,dc=linux to the regular group

```
dn: cn=admin,ou=groups,dc=company,dc=local,dc=test,dc=linux
objectclass: top
objectclass: groupofnames
cn: admin
description: admin users
member: cn=admin,dc=company,dc=local,dc=test,dc=linux



dn: cn=regular,ou=groups,dc=company,dc=local,dc=test,dc=linux
objectclass: top
objectclass: groupofnames
cn: regular
description: regular users
member: cn=regularuser,cn=Users,dc=company,dc=local,dc=test,dc=linux
```

Add the group 

sudo ldapadd -D cn=admin,dc=company,dc=local,dc=test,dc=linux -w password -f createGroup.ldif

you can run the following command to see if it's all set up properly:

sudo ldapsearch -x -LLL -H ldap:/// -b cn=admin,dc=company,dc=local,dc=test,dc=linux dn memberof

And it should yield this result

```
dn: cn=admin,dc=company,dc=local,dc=test,dc=linux
memberOf: cn=admin,ou=groups,dc=example,dc=com
```