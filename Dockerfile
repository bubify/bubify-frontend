FROM ubuntu:22.04

ARG DEBIAN_FRONTEND=noninteractive

LABEL maintainer="jonas@norlinder.nu"

RUN apt update
RUN apt upgrade -y

#git && \
# rm -rf /var/lib/apt/lists/* && \
# apt clean

RUN apt install -y wget apt-transport-https gnupg curl sudo tmux emacs nano htop maven git less
RUN mkdir -p /etc/apt/keyrings
RUN curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
RUN apt-get update
RUN apt install -y nodejs
RUN npm -g install yarn

RUN useradd -ms /bin/bash bubify
RUN usermod -aG sudo bubify

RUN echo "bubify     ALL=(ALL) NOPASSWD:ALL" >> /etc/sudoers

WORKDIR /home/bubify

USER bubify

RUN mkdir -p frontend
RUN mkdir -p frontend/build
RUN mkdir -p frontend/node_modules

ENV AU_BACKEND_HOST=
ENV AU_FRONTEND_HOST=
ENV AU_APP_API=
ENV AU_APP_WEBSOCKET=

WORKDIR /home/bubify
COPY --chown=bubify:bubify start.sh /home/bubify
RUN chmod +x start.sh

EXPOSE 3000
CMD ["./start.sh"]
