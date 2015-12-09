FROM ubuntu
MAINTAINER Team Wattellina <wattellina@mondora.com>

# Install nginx
RUN apt-get update
RUN apt-get install -y software-properties-common
RUN add-apt-repository -y ppa:nginx/development
RUN apt-get update
RUN apt-get install -y nginx

# Install nodejs
RUN apt-get update
RUN apt-get install -y curl
RUN curl -sL https://deb.nodesource.com/setup_5.x | bash -
RUN apt-get install -y nodejs build-essential

# Install awscli
RUN apt-get install python2.7
RUN curl -O https://bootstrap.pypa.io/get-pip.py
RUN python2.7 get-pip.py
RUN pip install awscli

# Install agent
RUN mkdir /asd-agent
ADD ./ /asd-agent/
RUN npm install --global --unsafe-perm /asd-agent/
RUN asd-setup
EXPOSE 34051

CMD ["asd-agent"]
