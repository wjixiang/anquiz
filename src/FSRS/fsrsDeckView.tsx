import { ItemView, WorkspaceLeaf } from "obsidian";
import fsrsApp from "./fsrsDeck";
import { createRoot } from "react-dom/client";
import React from "react";

export default class fsrsDeckView extends ItemView{
	ui:fsrsApp

	constructor(ui: fsrsApp, leaf:WorkspaceLeaf){
		super(leaf);
		this.ui = ui 
	}  
 
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
        const root = createRoot(container);  
        // Render the component properly with its props  
        root.render(
			React.createElement(fsrsApp,{plugin: this.ui.props.plugin})
		);  
    }  

}

