import { ItemView, WorkspaceLeaf } from "obsidian";
import React from "react";
import { createRoot } from "react-dom/client";
import anquizFSRS, { fsrsAppProps } from "./fsrs";

export default class fsrsView extends ItemView{ //UI container of obsidian
	fsrs:anquizFSRS
	root = createRoot(this.containerEl.children[1])
	constructor(leaf:WorkspaceLeaf,fsrs:anquizFSRS){
		super(leaf);
		this.fsrs = fsrs
	}  
 
	getViewType(): string {
		return "fsrsView" 
	}
	getDisplayText(): string { 
		return "fsrs-panel"
	}
	renderComponent(fsrsApp:React.FC<fsrsAppProps>) {  
        this.root.render(  
            React.createElement(fsrsApp, this.fsrs.appProps)  
        );  
    }  

    protected async onOpen(): Promise<void> {  
        this.renderComponent(this.fsrs.fsrsApp)
    }  

}
