import * as vscode from "vscode";
import { OUTPUT_CHANNEL } from "./logging";
import { SampleTreeDataProvider } from "./view";

export function activate(context: vscode.ExtensionContext) {
  // set up logging
  context.subscriptions.push(OUTPUT_CHANNEL);

  // set up view
  const provider = new SampleTreeDataProvider();
  const providerDisposable = vscode.window.registerTreeDataProvider(
    "viewItemUpdates.viewItems",
    provider,
  );
  context.subscriptions.push(providerDisposable);

  // set up command
  const commandDisposable = vscode.commands.registerCommand(
    "viewItemUpdates.triggerLoading",
    () => {
      provider.triggerLoading();
    },
  );
  context.subscriptions.push(commandDisposable);
}

export function deactivate() {}
