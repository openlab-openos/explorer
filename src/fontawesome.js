// src/fontawesome.js
// import { library } from '@fortawesome/fontawesome-svg-core';
// import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faChevronUp } from '@fortawesome/free-solid-svg-icons';
import { faHdd as farHdd, faHandPointUp as farHandPointUp } from '@fortawesome/free-regular-svg-icons';

// // 添加你需要的图标到库中
// library.add(faChevronUp, farHdd, farHandPointUp);

// export { FontAwesomeIcon };


import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faChartPie, faExchangeAlt, faAdjust, faStopCircle, faHourglass, faDollarSign, faDatabase, faCubes, faEuroSign, faWonSign, faYenSign, faMoneyBillAlt } from '@fortawesome/free-solid-svg-icons';
import { faRegistered } from '@fortawesome/free-regular-svg-icons';
import { faChrome, faOpenid, faPagelines, faYelp, faMizuni, faSpeakap, faSkype, faSellsy, faFlickr } from '@fortawesome/free-brands-svg-icons';

// 添加你需要的图标到库中
library.add(faChevronUp, farHdd, farHandPointUp, faChartPie, faAdjust, faStopCircle, faHourglass, faDollarSign, faDatabase, faCubes, faEuroSign, faWonSign, faYenSign, faMoneyBillAlt, faRegistered, faChrome, faOpenid, faPagelines, faYelp, faMizuni, faSpeakap, faSkype, faSellsy, faFlickr, faExchangeAlt);
library.add(faChevronUp, farHdd, farHandPointUp);
export { FontAwesomeIcon };
