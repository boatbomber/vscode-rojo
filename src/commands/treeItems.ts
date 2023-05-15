import * as path from "path"
import * as vscode from "vscode"
import { State } from "../extension"
import { getRojoInstall } from "../getRojoInstall"
import { RojoProjectListing } from "../treeView"
import { serveProject } from "../serveProject"
import { buildProject } from "../buildProject"

export const serveProjectCommand = (state: State) =>
  vscode.commands.registerCommand(
    "vscode-rojo.serveProject",
    async (treeItem: RojoProjectListing) => {
      if (treeItem && treeItem.path) {
        try {
          const uri = vscode.Uri.file(treeItem.path.fsPath)

          // This throws if the file doesn't exist
          await vscode.workspace.fs.stat(uri)

          const workspaceFolder = vscode.workspace.getWorkspaceFolder(uri)

          if (workspaceFolder) {
            const projectFile = {
              name: path.basename(treeItem.path.fsPath),
              workspaceFolderName: workspaceFolder.name,
              path: uri,
            }

            const install = await getRojoInstall(projectFile).catch(() => null)

            if (install) {
              return serveProject(state, projectFile)
            }
          }
        } catch (e) {
          // fall through
        }
      }

      vscode.commands.executeCommand("vscode-rojo.openMenu")
    }
  )

export const buildProjectCommand = (state: State) =>
  vscode.commands.registerCommand(
    "vscode-rojo.buildProject",
    async (treeItem: RojoProjectListing) => {
      if (treeItem && treeItem.path) {
        try {
          const uri = vscode.Uri.file(treeItem.path.fsPath)

          // This throws if the file doesn't exist
          await vscode.workspace.fs.stat(uri)

          const workspaceFolder = vscode.workspace.getWorkspaceFolder(uri)

          if (workspaceFolder) {
            const projectFile = {
              name: path.basename(treeItem.path.fsPath),
              workspaceFolderName: workspaceFolder.name,
              path: uri,
            }

            const install = await getRojoInstall(projectFile).catch(() => null)

            if (install) {
              return buildProject(projectFile)
            }
          }
        } catch (e) {
          // fall through
        }
      }

      vscode.commands.executeCommand("vscode-rojo.openMenu")
    }
  )
