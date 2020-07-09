import { isDev } from '@/base/platform';

const product = require('./../../../product.json');

if (isDev) {
  product.nameShort += ' Dev';
  product.nameLong += ' Dev';
}

product.date = new Date().toDateString();

export default product;
