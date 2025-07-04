# Use official Node.js LTS image
FROM node:18

# Set working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the app
COPY . .

# Expose the port from .env or default to 5000
EXPOSE 5000

# Start the app
CMD ["npm", "start"]
