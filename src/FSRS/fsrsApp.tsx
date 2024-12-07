import { ItemView, WorkspaceLeaf } from 'obsidian';
import FsrsDeck from "./fsrsDeck";
import { deckProps, deckTree } from './component/treeNode';
import { createRoot } from "react-dom/client";
import React, {  useState } from "react";
import anquizFSRS from './fsrs';
import { FsrsStudy } from './component/study';


export default class fsrsDeckView extends ItemView{
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
	renderComponent() {  
        this.root.render(  
            React.createElement(fsrsApp, this.fsrs.appProps)  
        );  
    }  

    protected async onOpen(): Promise<void> {  
        this.renderComponent()
    }  

}

export interface fsrsAppProps {
	deckProps:deckProps;
	selectedDeck: deckTree|null;
	currentPage: string;
}

const fsrsApp: React.FC<fsrsAppProps> = (initialProps)=>{
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const [appProps, setAppProps] = useState(initialProps);  
	const [currentPage, setCurrentPage] = useState<string>('deck');  
    const [selectedDeck, setSelectedDeck] = useState<deckTree | null>(null); 



	const openSchedule = (deckTree: deckTree, update: () => void) => {  
        setSelectedDeck(deckTree);  
        setCurrentPage('study');  
        // 如果有额外的更新逻辑，执行传入的 update 函数  
        update();  
    };  

	const backHome = ()=>{
		setCurrentPage('deck'); 
	}


	const renderPage = ()=>{
		switch (currentPage){
			case 'deck':
				return <FsrsDeck 
					deckTreeList={appProps.deckProps.deckTreeList} 
					openSchedule={openSchedule} />
			case 'study':
				return <FsrsStudy deck={selectedDeck}  backHome={backHome}/>
		}
	
	}
	return(
		<div>
			{renderPage()}
		</div>
	)
}


