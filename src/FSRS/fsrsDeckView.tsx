import { ItemView, WorkspaceLeaf } from "obsidian";
import fsrsDeck, { deckProps } from "./fsrsDeck";
import { createRoot } from "react-dom/client";
import React from "react";

export default class fsrsDeckView extends ItemView{
	props:deckProps

	constructor(props:deckProps, leaf:WorkspaceLeaf){
		super(leaf);
		this.props = props
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
			React.createElement(fsrsDeck,this.props)
		);  
    }  

}

