import { Component, ReactNode } from "react";

import anquizFSRS from "./fsrs";
import fsrsView from "./fsrsView";
import Anquiz from "src/main";
import { WorkspaceLeaf } from 'obsidian';


interface fsrsAppProps {
	plugin: Anquiz
}

export default class fsrsApp extends Component<fsrsAppProps>{
	api: anquizFSRS;
	view = (leaf:WorkspaceLeaf)=>{return new fsrsView(this,leaf)};
	style = {  
		head_menu: {  
			display: 'flex',  
			justifyContent: 'space-around'  
		}  
	}

	constructor(props:fsrsAppProps){
		super(props);
		this.api = new anquizFSRS(props.plugin)
	}

	async init(){
		await this.api.db.init()
		this.test()
	}

	test(){
		console.log("launch fsrsApp")
	}
 
	render(): ReactNode {
		console.log(this.style.head_menu)
		return(
		<div>
			<div id="head_menu" className="fsrs-menu" style={this.style.head_menu}>
				<div className="head-button">Deck</div>
				<div className="head-button">Analysis</div>
				<div className="head-button">info</div>
			</div>
		</div>
		)
	}
}
