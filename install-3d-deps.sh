#!/bin/bash

# Install 3D dependencies for the globe component
echo "Installing 3D dependencies..."

npm install --save @react-three/fiber@^8.15.0 @react-three/drei@^9.92.0 three@^0.160.0
npm install --save-dev @types/three@^0.160.0

echo "Dependencies installed successfully!"
echo "The server should hot-reload and pick up the new components."