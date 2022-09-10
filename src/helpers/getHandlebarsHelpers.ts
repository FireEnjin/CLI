import { extend } from "lodash";
import { format, parseISO } from "date-fns";
import * as jsonLogic from "json-logic-js";

export default function getHandlebarsHelpers() {
  return {
    everyNth: function (context, every, options) {
      var fn = options.fn,
        inverse = options.inverse;
      var ret = "";
      if (context && context.length > 0) {
        for (var i = 0, j = context.length; i < j; i++) {
          var modZero = i % every === 0;
          ret =
            ret +
            fn(
              extend({}, context[i], {
                isModZero: modZero,
                isModZeroNotFirst: modZero && i > 0,
                isLast: i === context.length - 1,
              })
            );
        }
      } else {
        ret = inverse(this);
      }
      return ret;
    },
    logic: (context, rules, tempData) =>
      jsonLogic.apply(JSON.parse(rules.replace('"@tempData"', tempData)), {
        ...context,
        tempData,
      }),
    formatUSD: (amount) => {
      const formatter = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 2,
      });

      return formatter.format(amount ? amount : 0);
    },
    date: (str, datePattern = "P", options = {}) => {
      try {
        const dateObj =
          typeof str === "object" && str?.constructor?.name === "Timestamp"
            ? str.toDate()
            : str || new Date();
        return format(
          typeof dateObj === "string" ? parseISO(dateObj) : dateObj,
          typeof datePattern === "string" ? datePattern : "P",
          options
        );
      } catch (error) {
        return str;
      }
    },
  };
}
