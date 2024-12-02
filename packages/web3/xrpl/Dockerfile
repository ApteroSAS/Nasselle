FROM ubuntu:22.04

# Update and install dependencies
RUN apt update && apt install -y curl

# Install Rust
RUN curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs > rust_install.sh
RUN sh rust_install.sh -y
ENV PATH="$PATH:/root/.cargo/bin"
RUN rustup target add wasm32-unknown-unknown

# Install build-essential for compiling
RUN apt install -y build-essential

# Use an official Rust image as a base
FROM rust:latest

# Set the working directory
WORKDIR /app

# Install dependencies
RUN apt-get update && apt-get install -y \
    nodejs \
    npm

# Build the Rust project
RUN cargo build --release

# Install frontend dependencies
WORKDIR /app/frontend/nasselle_ui
RUN npm install

# Expose ports
EXPOSE 3000
EXPOSE 8000

# Default command
CMD ["npm", "run", "dev"]

# Install Node.js (LTS version) and npm
RUN curl -fsSL https://deb.nodesource.com/setup_lts.x | bash -
RUN apt install -y nodejs

# Create and set workspace
RUN mkdir /workspace
WORKDIR /workspace
ENV IS_USING_DOCKER=true

# Verify Node.js and npm installation
RUN node -v
RUN npm -v

