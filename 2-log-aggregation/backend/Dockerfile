# Base image
FROM node:18

# Install netcat (used by wait-for-it.sh)
RUN apt-get update && apt-get install -y netcat-openbsd && rm -rf /var/lib/apt/lists/*

# Create app directory
WORKDIR /usr/src/app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all source code
COPY . .

# Make the wait script executable
RUN chmod +x wait-for-it.sh

# Expose dashboard port
EXPOSE 4000

# Default command
CMD ["npm", "start"]
