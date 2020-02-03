import { FluentApi } from "../fluent";
import { WrappedAbstractTree } from "./AbstractTree";

export interface PluginMetaData {
  name: string;
  description: string;
  hooks: PluginHooks;
}

export interface PluginHooks {
  /**
   * Runs before any user code will run
   */
  beforeRequire?: () => void;

  /**
   * Add things to the tree before converting and wrapping it as an WrappedAbstractTree
   */
  useFluentApi?: (api: FluentApi) => void;

  /**
   * A plugin may have custom limitations, e.g some types can't be generated
   * Please notify the user here in some way or another ;)
   */
  validateAbstractTree?: (tree: WrappedAbstractTree) => void;

  /**
   * The outputted strings and some extra data usefull for debugging or other plugins
   */
  buildOutput?: (tree: WrappedAbstractTree) => PluginBuildResultFile[];

  /**
   * Before writing the results to disk
   */
  inspectBuildResult?: (result: PluginBuildResult[]) => void;

  /**
   * After writing the results to disk
   */
  postRunner?: () => void;
}

export interface PluginBuildResult {
  name: string;
  files: PluginBuildResultFile[];
}

export interface PluginBuildResultFile {
  path: string;
  source: string;
}
