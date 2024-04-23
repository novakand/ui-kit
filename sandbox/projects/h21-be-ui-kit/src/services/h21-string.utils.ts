export class H21StringUtils {

  public static capitalize(string: string): string {
    return string.charAt(0)
      .toUpperCase() + string.slice(1);
  }

  public static isJSON(str: string): boolean {
    if (!this.isString(str)) {
      return false;
    }

    str = str.replace(/\s/g, '')
      .replace(/\n|\r/, '');

    if (/^\{(.*?)\}$/.test(str)) {
      return /"(.*?)":(.*?)/g.test(str);
    }

    if (/^\[(.*?)\]$/.test(str)) {
      return str.replace(/^\[/, '')
        .replace(/\]$/, '')
        .replace(/},{/g, '}\n{')
        .split(/\n/)
        .map((s) => this.isJSON(s))
        .reduce((prev: any, curr: any) => !!curr);
    }

    return false;
  }

  public static isString(x: any): boolean {
    return Object.prototype.toString.call(x) === '[object String]';
  }

  public static getNumber(number: string, isReplace?: boolean): string {
    if (!number || !isReplace) { return number; }
    const numL = number.length;
    if (isReplace === true) {
      return  (numL >= 4)  ? `${number.substring(0, 2)}${'**********'}${number.substring(numL - 4, numL)}` : '**********';
    }
    return number;
  }

}
