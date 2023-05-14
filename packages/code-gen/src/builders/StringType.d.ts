export class StringType extends TypeBuilder {
  static baseData: {
    oneOf: undefined;
    validator: {
      allowNull: boolean;
      trim: boolean;
      lowerCase: boolean;
      upperCase: boolean;
      min: number;
      max: undefined;
      pattern: undefined;
      disallowedCharacters: undefined;
    };
  };
  constructor(group: any, name: any);
  /**
   * @param {...string} values
   * @returns {StringType}
   */
  oneOf(...values: string[]): StringType;
  /**
   * @returns {StringType}
   */
  trim(): StringType;
  /**
   * @returns {StringType}
   */
  upperCase(): StringType;
  /**
   * @returns {StringType}
   */
  lowerCase(): StringType;
  /**
   * @param {number} min
   * @returns {StringType}
   */
  min(min: number): StringType;
  /**
   * @param {number} max
   * @returns {StringType}
   */
  max(max: number): StringType;
  /**
   * @param {RegExp} pattern
   * @returns {StringType}
   */
  pattern(pattern: RegExp): StringType;
  /**
   * @param {string[]} characterArray
   * @returns {StringType}
   */
  disallowCharacters(characterArray: string[]): StringType;
}
import { TypeBuilder } from "./TypeBuilder.js";
//# sourceMappingURL=StringType.d.ts.map
