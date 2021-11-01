import React from "react";
import { CircularProgress } from "@mui/material";

import "./spinner.scss";

export const Spinner: React.FC = () => (
  <div className="spinner-wrapper">
    <CircularProgress />
  </div>
);
