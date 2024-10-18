import {Box, Typography} from "@mui/material";
import React from "react";

export const StepDockerInstall = () => (
    <Typography>
      First, get your NAS and ensure that your NAS supports Docker, with Docker and Docker Compose installed. This
      is crucial for smooth running. NSL Router and Casa OS heavily rely on containers to work. You can install Docker
      Desktop by following the <a href="https://docs.docker.com/desktop/install/windows-install/">Docker Desktop
      installation guide</a> or
      install Docker Community Edition by following the <a href="https://docs.docker.com/engine/install/">Docker
      Community installation guide</a>.
    </Typography>
);