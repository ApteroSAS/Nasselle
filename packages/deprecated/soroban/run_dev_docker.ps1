# Define the local directory and container mount path
$localDir = (Get-Location).Path
$containerMountPath = "/workspace"


docker build -t soroban-dev .
# Run the Ubuntu container with the local directory bind-mounted to /app and interactive terminal
docker run -it --name soroban-dev -v "${localDir}:${containerMountPath}" soroban-dev
