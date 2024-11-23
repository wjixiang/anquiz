import { ItemView } from "obsidian";

export default class fsrsView extends ItemView{
	getViewType(): string {
		return "fsrsView"
	}
	getDisplayText(): string {
		return "fsrs-panel"
	}

	protected async onOpen(): Promise<void> {
		const container = this.containerEl.children[1];
		container.empty();
		container.createEl('h4', { text: 'Example view' });
	}

}
