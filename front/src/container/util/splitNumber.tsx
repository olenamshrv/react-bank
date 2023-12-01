export function splitNumber(value: number, type?: string) {
    const formattedValue = Number(value).toLocaleString('en-US', {style: "currency", currency: "USD"});
  
    const splittedValue = formattedValue.split(".");
  
    let intPart, decPart, prefix="";
  
    if (!type) {
      if (value<0) {
        prefix = "-";
        intPart = splittedValue[0].slice(2);
      } else {
        intPart = splittedValue[0].slice(1);
      }
  
      decPart = splittedValue[1];
  
      return {prefix, intPart, decPart}
    }
  
    if (type === "Sending") {
      intPart = "-".concat(splittedValue[0])
      decPart = ".".concat(splittedValue[1])
    }
    if (type === "Receipt") {
      intPart = "+".concat(splittedValue[0])
      decPart = ".".concat(splittedValue[1])
    }
  
    return {intPart, decPart}
}