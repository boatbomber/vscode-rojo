import * as vscode from "vscode"
import { join } from "path"
import { findProjectFiles, ProjectFile } from "./findProjectFiles"
import { result } from "./result"

export class RojoProjectsProvider
  implements vscode.TreeDataProvider<RojoProjectListing>
{
  workspaceRoot: string | undefined

  constructor() {
    if (vscode.workspace.workspaceFolders) {
      this.workspaceRoot = vscode.workspace.workspaceFolders[0].uri.fsPath
    }
  }

  getTreeItem(element: RojoProjectListing): vscode.TreeItem {
    return element
  }

  getChildren(): Thenable<RojoProjectListing[]> {
    if (!this.workspaceRoot) {
      vscode.window.showInformationMessage("No projects in empty workspace")
      return Promise.resolve([])
    }

    return findProjectFiles()
      .then((projects) => {
        return projects.map((project) => {
          return new RojoProjectListing(
            project.name.substring(0, project.name.length - 13),
            project.path,
            vscode.TreeItemCollapsibleState.None
          )
        })
      })
      .catch((error) => {
        result(error)
        return []
      })
  }
}

export class RojoProjectListing extends vscode.TreeItem {
  constructor(
    public readonly label: string,
    public readonly path: vscode.Uri,
    public readonly collapsibleState: vscode.TreeItemCollapsibleState
  ) {
    super(label, collapsibleState)
    this.path = path
  }

  contextValue = "rojoProject"
  iconPath = {
    light: join(__filename, "..", "..", "assets", "rojo-icon.png"),
    dark: join(__filename, "..", "..", "assets", "rojo-icon.png"),
  }
}

export class RojoProjectDetailsProvider
  implements vscode.TreeDataProvider<vscode.TreeItem>
{
  projectFile: vscode.Uri | undefined

  _onDidChangeTreeData: vscode.EventEmitter<any> =
    new vscode.EventEmitter<any>()
  onDidChangeTreeData: vscode.Event<any> = this._onDidChangeTreeData.event

  constructor() {}

  setProject(project: vscode.Uri | undefined) {
    this.projectFile = project
    this._onDidChangeTreeData.fire(null)
  }

  getTreeItem(element: vscode.TreeItem): vscode.TreeItem {
    return element
  }

  getChildren(): Thenable<vscode.TreeItem[]> {
    if (!this.projectFile) {
      return Promise.resolve([new vscode.TreeItem("No project selected")])
    }

    return Promise.resolve([
      new vscode.TreeItem(this.projectFile.fsPath),
      new vscode.TreeItem("Details WIP"),
    ])
  }
}
