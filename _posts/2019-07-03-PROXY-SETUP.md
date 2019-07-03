---
layout:     post
title:      "Proxy setup"
subtitle:   "Guide for configuring processes behind proxies"
date:       2019-07-03 19:27:00
author:     "Krystian Wojcicki"
header-img: "img/posts/jekyll-bg.jpg"	
comments: true
tags: [ Guide ]
---

***
Interested in adding more configurations? [Head here](https://github.com/kwojcicki/kwojcicki.github.io/issues/14) and comment adding more!
***

#### curl/apt/many others

```
vi /etc/environment
```

append the following:

```
http_proxy=http://<host:port>
https_proxy=http://<host:port>
ftp_proxy=http://<host:port>
no_proxy="localhost,127.0.0.0"
```

#### most cli apps/any app that utilizes $http_proxy variables

```
vi ~/.bashrc
```

 append the following:

```
http_proxy=http://<host:port>
https_proxy=http://<host:port>
ftp_proxy=http://<host:port>
no_proxy="localhost,127.0.0.0,24,192.168.39.0/24"
HTTP_PROXY=$http_proxy
HTTPS_PROXY=$https_proxy
NO_PROXY=$no_proxy
```

#### vscode (Visual Studio Code)

Start up vscode using the following command

```
code --proxy-server="http=$http_proxy;https=$https_proxy"
```

Or you can set the [http_proxy variable in the settings file](https://code.visualstudio.com/docs/setup/network) but some features (such as the extensions marketplace) have yet to migrate over to the new proxy settings and I would recommend sticking with the above method.

#### Maven

```
vi $~/.m2/settings.xml
```

append or create the file with the following content

```
<settings>
  .
  .
  <proxies>
   <proxy>
      <id>example-proxy</id>
      <active>true</active>
      <protocol>http</protocol>
      <host>proxy.example.com</host>
      <port>8080</port>
      <username>proxyuser</username>
      <password>somepassword</password>
      <nonProxyHosts>www.google.com|*.example.com</nonProxyHosts>
    </proxy>
  </proxies>
  .
  .
</settings>
```

#### Docker

For the Docker client (ie the docker containers one creates)

```
vi ~/.docker/config.json
```

```
{
 "proxies":
 {
   "default":
   {
     "httpProxy": "http://127.0.0.1:3001",
     "httpsProxy": "http://127.0.0.1:3001",
     "noProxy": "*.test.example.com,.example2.com"
   }
 }
}
```

For the docker daemon (ie for when you pull/push images) on a systemd machine

```
sudo mkdir -p /etc/systemd/system/docker.service.d
```

If you are behind an http proxy

```
sudo vi /etc/systemd/system/docker.service.d/http-proxy.conf
```

```
[Service]
Environment="HTTP_PROXY=http://proxy.example.com:80/"
```

Or if you are behind an https proxy

```
sudo vi /etc/systemd/system/docker.service.d/https-proxy.conf
```

```
[Service]
Environment="HTTPS_PROXY=https://proxy.example.com:443/"	
```

Then reload the changes

```
sudo systemctl daemon-reload
sudo systemctl restart docker
```

And ensure your proxy appears in the following output

```
systemctl show --property=Environment docker
```