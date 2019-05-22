import React from "react";
import PlaceTwoToneIcon from "@material-ui/icons/PlaceTwoTone";

export default ({ size, color, onClick }) => (
  <PlaceTwoToneIcon
    onClick={onClick}
    style={{ fontSize: size, color }}
  />
);
