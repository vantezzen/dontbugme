import React from 'react';
import { render } from 'react-dom';

import Popup from './Popup';
import './index.css';

import 'fontsource-poppins/300.css';
import 'fontsource-poppins';
import 'fontsource-poppins/600.css';
import 'fontsource-poppins/700.css';
import 'fontsource-poppins/800.css';
import 'fontsource-poppins/900.css';

import "./plausible";

// @ts-ignore
window.plausible = window.plausible || function() { (window.plausible.q = window.plausible.q || []).push(arguments) }

render(<Popup />, window.document.querySelector('#app-container'));

// @ts-ignore 2339
if (module.hot) module.hot.accept();
