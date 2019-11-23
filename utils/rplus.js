/* eslint-disable */
import React from 'react';
import ReactDOM from 'react-dom';
import htm from 'htm';
import css from 'csz';

const html = htm.bind(React.createElement);
const react = {
  ...React,
  render: ReactDOM.render,
};

export { react, html, css };
