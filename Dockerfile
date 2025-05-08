FROM node:20-alpine

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./

# Install dependencies
RUN npm install

# Bundle app source
COPY . .

# Build TypeScript
RUN npm install -g typescript
RUN tsc

# Expose port
EXPOSE 3001

# Start the application
CMD ["node", "dist/server.js"] 