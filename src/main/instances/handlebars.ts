import Handlebars from 'handlebars';

Handlebars.registerHelper('eq', (value1, value2) => value1 === value2);

export default Handlebars;
