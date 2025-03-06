# Use an official Node.js runtime as a parent image
FROM node

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json before running npm install (for better caching)
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application files
COPY . .

# Expose the port if your server runs on a specific port (e.g., 3000)
EXPOSE 3000

# Corrected CMD syntax (should use comma-separated array)
CMD ["node", "server.js"]

