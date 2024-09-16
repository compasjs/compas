import { RandomUUIDOptions } from "crypto";

import { AppError } from "../src/error.js";

export type Either<T, E = AppError> =
	| { value: T; error?: never }
	| { value?: never; error: E };

export type EitherN<T, E = AppError> =
	| { value: T; errors?: never }
	| { value?: never; errors: E[] };

export interface NoopFn {
	(): void;
}

export interface UuidFunc {
	/**
	 * Returns true if value conforms a basic uuid structure.
	 * This check is case-insensitive.
	 */
	isValid: (value: any) => boolean;

	/**
	 * Return a new uuid v4
	 */ (options?: RandomUUIDOptions): string;
}

/**
 * Options for processDirectoryRecursive and processDirectoryRecursiveSync
 */
export interface ProcessDirectoryOptions {
	/**
	 * Skip node_modules directory, true by default
	 */
	skipNodeModules?: boolean;

	/**
	 * Skip files and directories starting with a '.', true
	 *   by default
	 */
	skipDotFiles?: boolean;
}
