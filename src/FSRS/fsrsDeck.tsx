// 重命名后的组件文件，例如 FsrsDeck.tsx  
import { Component, CSSProperties, ReactNode } from "react";  
import { TreeNode } from "./component/treeNode";  

interface deckTree {  
    root: string  
    leaf: deckTree[] | null  
}  

export interface deckProps {  
    deckTreeList: deckTree[]   
}  

interface deckState {  
    currentPage: 'Deck' | 'Analysis' | 'Info';  
    expandedNodes: Set<string>; // to track expanded node  
}  

export default class FsrsDeck extends Component<deckProps, deckState> {  
    constructor(props: deckProps) {  
        super(props);  
        this.state = {  
            currentPage: 'Deck',  
            expandedNodes: new Set<string>()  
        };   
        console.log(this.props.deckTreeList)  
    }  

    async componentDidMount() {  
        this.updatePageStyles();  
    }  

    handlePageChange = (page: 'Deck' | 'Analysis' | 'Info') => {  
        console.log(page)  
        this.setState({ currentPage: page }, () => {  
            this.updatePageStyles()  
        })  
    }  

    updatePageStyles = () => {  
        const headMenu = document.getElementById('head_menu');  
        if (headMenu) {  
            headMenu.classList.remove('deck-active', 'analysis-active', 'info-active');  

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
        };  

        const activeStyle: CSSProperties = isActive ? {  
            fontWeight: 'bold',  
            transform: 'scale(1.05)',  
            boxShadow: '0 2px 5px rgba(0,0,0,0.2)',   
            border: '2px solid rgba(255,255,255,0.2)'  
        } : {};  

        return { ...baseStyle, ...activeStyle };  
    }  

    handleNodeToggle = (nodePath: string) => {  
        this.setState(prevState => {  
            const newExpandedNodes = new Set(prevState.expandedNodes);  
            if (newExpandedNodes.has(nodePath)) {  
                newExpandedNodes.delete(nodePath);  
            } else {  
                newExpandedNodes.add(nodePath);  
            }  
            return { expandedNodes: newExpandedNodes };  
        });  
    }   
   
    render(): ReactNode {  
        console.log("hello", this.props.deckTreeList)  
        return(  
            <div>  
                <div id="head_menu" className="fsrs-menu" >  
                    <div   
                        className={`head-button ${this.state.currentPage === 'Deck' ? 'active' : ''}`}  
                        style={this.getButtonStyle('Deck')}  
                        onClick={() => this.handlePageChange('Deck')}  
                    >Deck</div>  
                    <div   
                        className={`head-button ${this.state.currentPage === 'Analysis' ? 'active' : ''}`}  
                        style={this.getButtonStyle('Analysis')}  
                        onClick={() => this.handlePageChange('Analysis')}  
                    >Analysis</div>  
                    <div   
                        className={`head-button ${this.state.currentPage === 'Info' ? 'active' : ''}`}  
                        style={this.getButtonStyle('Info')}  
                        onClick={() => this.handlePageChange('Info')}  
                    >Info</div>  
                </div>  

                <div className="deck-tree">  
                    {this.props.deckTreeList && this.props.deckTreeList.map((node, index) => (  
                        <TreeNode   
                            key={`tree-${index}`}  
                            node={node}  
                            onToggle={this.handleNodeToggle}  
                            isExpanded={this.state.expandedNodes.has(node.root)}  
                        />  
                    ))}   
                </div>  
            </div>  
        )  
    }  
}
