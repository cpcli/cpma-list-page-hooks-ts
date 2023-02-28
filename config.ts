// 抽奖相关接口
const NODE_ENV = process.env.PRODUCT_ENV;
const config = {
  development: {
    ROOTPATH: 'https://cpmart-market-dev.cpgroupcloud.com'
  },
  stg: {
    ROOTPATH: 'https://cpmart-market-dev.cpgroupcloud.com'
  },
  production: {
    ROOTPATH: 'https://cpmart-market-i.cpgroupcloud.com',
  },
}

export const domain = config[NODE_ENV].ROOTPATH

// 优惠券列表
const config_coupon = {
  development: {
    ROOTPATH: 'https://cpmart-market-dev.cpgroupcloud.com'
  },
  stg: {
    ROOTPATH: 'https://cpmart-market-dev.cpgroupcloud.com'
  },
  production: {
    ROOTPATH: 'https://cpmart-market-ii.cpgroupcloud.com',
  },
}

export const domain_coupon = config_coupon[NODE_ENV].ROOTPATH
