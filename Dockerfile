# Use a base image with Node.js version 18.18 pre-installed
FROM node:18.18

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of your application code to the container
COPY . .

# Expose the port your server listens on
EXPOSE 1840/tcp

# Command to run your server
CMD ["npm", "start"]