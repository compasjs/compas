# Workspaces

Compas comes with out-of-the-box support for workspaces. All
[actions and defaults](/docs/actions-and-defaults.html) from the previous
chapter are executed for the known projects in a workspace. Allowing you to run
Compas once and get the benefits for all projects that you are working on
simultaneously.

## Enabling workspaces

The configuration file `config/compas.json` allows you to define related
projects, for example:

```json [config/compas.json]
{
  "projects": ["packages/shared"]
}
```

This registers a sub project in `$root/packages/shared`. All automatic actions
that Compas executes are now also done relative to that directory. You can
create another config in `$root/packages/shared/config/compas.json` to define
custom actions for that specific project and to add even more nested projects.

Navigation to subprojects is automatically added:

![Navigation from the root project](/workspace-navigation-home.png)

Compas also allows projects to be in a sibling directory:

```json [config/compas.json]
{
  "projects": ["../project-frontend"]
}
```

In this case, the sibling directory is optional and not loaded if it can not be
found. It is also allowed to create recursive project references, so you can set
up Compas in all individual projects, and it automatically includes the other
projects when they are found. Giving the same experience no matter which project
you are currently working on.

## Limitations

- Compas assumes that nested projects are also setup correctly in your package
  manager and only runs installation (e.g `npm install`) in the root project.
  For sibling projects, Compas runs the inferred package manager in each
  project.
- Compas stores its cache in the project that you started Compas in and removes
  the cache from referenced projects. This way Compas has a single source of
  truth. So the most efficient way of developing is to always start Compas from
  the same project and to navigate inside Compas to other projects when
  necessary.
- Only 9 subprojects are supported currently.
