# Use an Ubuntu base image
FROM ubuntu:22.04

# Install dependencies
RUN apt-get update && \
    apt-get install -y \
    curl \
    python3 \
    python3-pip \
    unzip \
    socat \
    build-essential \
    libssl-dev \
    iproute2 \
    && rm -rf /var/lib/apt/lists/*

# Install Node.js 18 directly
RUN curl -fsSL https://deb.nodesource.com/setup_18.x | bash - && \
    apt-get install -y nodejs

# Add NVM to PATH
ENV NVM_DIR /root/.nvm
ENV NODE_VERSION 18.0.0
RUN . $NVM_DIR/nvm.sh && nvm install $NODE_VERSION
ENV NODE_PATH $NVM_DIR/versions/node/v$NODE_VERSION/lib/node_modules
ENV PATH $NVM_DIR/versions/node/v$NODE_VERSION/bin:$PATH

# Set the working directory
WORKDIR /usr/src/app

# Copy dependency files
COPY package*.json ./

# Install npm dependencies
RUN npm install

RUN npx update-browserslist-db@latest

# Copy application files
COPY . .

# Expose necessary ports
EXPOSE 5173

CMD ["npx", "vite", "--host"]
