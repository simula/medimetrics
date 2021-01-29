import React from "react";
import { ZoomyDiv } from "../animations/zoomIn";
const Intro = ({ text }) => {
  return (
    <div className="intro">
      <ZoomyDiv>{text}</ZoomyDiv>
    </div>
  );
};

export default Intro;
