# Define variables
$imageName = "nasselle-vnas-orchestrator"
$containerName = "nasselle-vnas-orchestrator-dev"
$dockerfilePath = "."
$originalPath = Get-Location

# Change to the Dockerfile directory
Push-Location $dockerfilePath

try {
    # Build the Docker image
    Write-Host "Building the Docker image..."
    docker build -t $imageName .

    if ($LASTEXITCODE -ne 0) {
        throw "Docker build failed. Exiting."
    }

    # Check if a container with the same name is already running
    Write-Host "Checking for existing container..."
    $existingContainer = docker ps -aq --filter "name=$containerName"

    if ($existingContainer) {
        Write-Host "Stopping and removing existing container..."
        docker stop $containerName
        docker rm $containerName

        if ($LASTEXITCODE -ne 0) {
            throw "Failed to stop and remove existing container. Exiting."
        }
    }

    # Run the Docker container
    # docker network create meta
    Write-Host "Running the Docker container..."
    # provider network is used locally so we can get an host name to resolve from inside the container (in prod it will just be the domain)
    # in this case we use "dprovider" as the hostname os the provider container is resolved from the requester but the announced domain is localhost
    # you have to create a network called provider docker network create provider
    docker run -d `
    -v "$originalPath/.env:/app/.env" `
    -p 8194:8194 `
    --name $containerName $imageName

    # run that : chmod 600 ./key/id-ed25519

    if ($LASTEXITCODE -ne 0) {
        throw "Docker run failed. Exiting."
    }

    Write-Host "Docker container $containerName is up and running."
}
catch {
    Write-Host $_
    exit $LASTEXITCODE
}
finally {
    # Ensure to return to the original path
    Pop-Location
}
