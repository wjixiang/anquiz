import { Component, CSSProperties, ReactNode } from "react";  

import anquizFSRS from "./fsrs";  
import fsrsView from "./fsrsDeckView";  
import Anquiz from "src/main";  
import { WorkspaceLeaf } from 'obsidian';  

interface fsrsAppProps {   
    plugin: Anquiz  
}  

interface fsrsAppState {  
    currentPage: 'Deck' | 'Analysis' | 'Info';  
}  

export default class fsrsApp extends Component<fsrsAppProps, fsrsAppState> {  
    api: anquizFSRS;  
    view = (leaf:WorkspaceLeaf)=>{return new fsrsView(this,leaf)};	  

    constructor(props:fsrsAppProps){  
        super(props);  
		this.state = {  
			currentPage: 'Deck'  
		}; 
        this.api = new anquizFSRS(props.plugin)  
    }  

    async componentDidMount() {  
        // Move initialization logic here  
        this.init();  
        // Initial page styles can be set here  
        this.updatePageStyles();  
    }  

    async init(){  
        await this.api.db.init()  
    }  

    handlePageChange = (page: 'Deck'|'Analysis'|'Info')=>{  
		console.log(page)
        this.setState({currentPage: page}, () => {  
            this.updatePageStyles()  
        })  
    }  

    updatePageStyles = () => {  
        const headMenu = document.getElementById('head_menu');  
        if (headMenu) {  
            // Remove any previous custom classes  
            headMenu.classList.remove('deck-active', 'analysis-active', 'info-active');  
    
            // Add class based on current page  
            switch (this.state.currentPage) {  
                case 'Deck':  
                    headMenu.classList.add('deck-active');  
                    break;  
                case 'Analysis':  
                    headMenu.classList.add('analysis-active');  
                    break;  
                case 'Info':  
                    headMenu.classList.add('info-active');  
                    break;  
            }  
        }  
    }  

    getButtonStyle = (buttonPage: 'Deck' | 'Analysis' | 'Info'): CSSProperties => {  
        const isActive = this.state.currentPage === buttonPage;  
        
        const baseStyle: CSSProperties = {  
            cursor: 'pointer',  
            padding: '10px',  
            // transition: 'all 0.3s ease',  
        };  

        const activeStyle: CSSProperties = isActive ? {  
            fontWeight: 'bold',  
            transform: 'scale(1.05)',  
            boxShadow: '0 2px 5px rgba(0,0,0,0.2)', 
			border: '2px solid rgba(255,255,255,0.2)'
        } : {};  

        return { ...baseStyle, ...activeStyle };  
    }  
   
    render():ReactNode {  
        return(  
        <div>  
            <div id="head_menu" className="fsrs-menu" >  
                <div   
                    className={`head-button ${this.state.currentPage === 'Deck' ? 'active' : ''}`}  
                    style={this.getButtonStyle('Deck')}  
                    onClick={()=>this.handlePageChange('Deck')}  
                >Deck</div>  
                <div   
                    className={`head-button ${this.state.currentPage === 'Analysis' ? 'active' : ''}`}  
                    style={this.getButtonStyle('Analysis')}  
                    onClick={()=>this.handlePageChange('Analysis')}  
                >Analysis</div>  
                <div   
                    className={`head-button ${this.state.currentPage === 'Info' ? 'active' : ''}`}  
                    style={this.getButtonStyle('Info')}  
                    onClick={()=>this.handlePageChange('Info')}  
                >Info</div>  
            </div>  
        </div>  
        )  
    }  
}
