import React from "react";
const Footer = ({ text }) => {
  return (
    <footer>
      <i className="fa fa-lg fa-copyright mr-1" aria-hidden="true"></i>
      <span>{text}</span>
      <a
        href="https://github.com/malekhammou/ai-metrics"
        target="_blank"
        rel="noreferrer">
        <i className="fa fa-github fa-2x github-repo"></i>
      </a>
    </footer>
  );
};

export default Footer;
