export class TypeBuilder {
  /**
   * @type {any}
   */
  static baseData: any;
  static getBaseData(): any;
  /**
   * @param {string} type
   * @param {string|undefined} [group]
   * @param {string|undefined} [name]
   */
  constructor(
    type: string,
    group?: string | undefined,
    name?: string | undefined,
  );
  data: any;
  /**
   * @param docValue
   * @returns {this}
   */
  docs(docValue: any): this;
  /**
   * @returns {this}
   */
  optional(): this;
  /**
   * @returns {this}
   */
  allowNull(): this;
  /**
   * @param rawString
   * @returns {this}
   */
  default(rawString: any): this;
  /**
   * @returns {this}
   */
  searchable(): this;
  /**
   * @returns {this}
   */
  primary(): this;
  /**
   * @returns {Record<string, any>}
   */
  build(): Record<string, any>;
}
//# sourceMappingURL=TypeBuilder.d.ts.map
