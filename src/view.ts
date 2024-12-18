import { Event, EventEmitter, ThemeIcon, TreeDataProvider, TreeItem, TreeItemLabel } from "vscode";
import { Logger } from "./logging";

const logger = new Logger("view");

class LoadableTreeItem extends TreeItem {
  constructor(label: string | TreeItemLabel, public isLoading: boolean = false) {
    super(label);
    this.id = String(label);
    this.iconPath = new ThemeIcon(isLoading ? "loading~spin" : "circle-outline");
  }
}

export class SampleTreeDataProvider implements TreeDataProvider<LoadableTreeItem> {
  private _onDidChangeTreeData: EventEmitter<LoadableTreeItem | undefined> = new EventEmitter<
    LoadableTreeItem | undefined
  >();
  readonly onDidChangeTreeData: Event<LoadableTreeItem | undefined> =
    this._onDidChangeTreeData.event;

  private items: LoadableTreeItem[] = [
    new LoadableTreeItem("Item 1"),
    new LoadableTreeItem("Item 2"),
  ];

  constructor() {
    this.onDidChangeTreeData((item) => {
      logger.debug("item changed:", item);
    });
  }

  getTreeItem(element: LoadableTreeItem): LoadableTreeItem | Thenable<LoadableTreeItem> {
    logger.info("getTreeItem called", { element });
    return new LoadableTreeItem(String(element.label), element.isLoading);
  }

  getChildren(element?: LoadableTreeItem): LoadableTreeItem[] | Thenable<LoadableTreeItem[]> {
    logger.info("getChildren called", { element });
    return this.items;
  }

  async triggerLoading() {
    logger.info("loading triggered");
    await Promise.all([this.loadItem(this.items[0]), this.loadItem(this.items[1], true)]);
  }

  async loadItem(item: LoadableTreeItem, useNewInstance: boolean = false) {
    if (useNewInstance) {
      // this should prove that no updates come through the UI when using a new instance
      logger.warn("using new instance of item", { label: item.label, id: item.id });
      item = new LoadableTreeItem(String(item.label));
    }

    logger.info("started item loading", { label: item.label, id: item.id });

    // set "loading" state
    item.isLoading = true;
    this._onDidChangeTreeData.fire(item);
    logger.info("item set to isLoading=true", { label: item.label, id: item.id });

    // random delay for "loading", between 1-10sec
    const timeout = Math.floor(Math.random() * 5_000) + 1000;
    logger.info(`waiting for ${timeout}ms`, { label: item.label, id: item.id });
    await new Promise((resolve) => setTimeout(resolve, timeout));

    // set "usable" state
    item.isLoading = false;
    this._onDidChangeTreeData.fire(item);
    logger.info("item set to isLoading=false", { label: item.label, id: item.id });

    logger.info("item loading complete", { label: item.label, id: item.id });
  }
}
