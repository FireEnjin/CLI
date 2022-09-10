export default function getHandlebarsHelpers(): {
    everyNth: (context: any, every: any, options: any) => string;
    logic: (context: any, rules: any, tempData: any) => any;
    formatUSD: (amount: any) => string;
    date: (str: any, datePattern?: string, options?: {}) => any;
};
