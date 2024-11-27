import React, { CSSProperties } from "react";  

interface deckTree {  
    root: string;  
    leaf: deckTree[] | null;  
}  

export interface deckProps {  
    deckTreeList: deckTree[];  
}  



// 可折叠树节点组件  
interface TreeNodeProps {  
    node: deckTree;  
    level?: number;  
    onToggle: (nodePath: string) => void;  
    isExpanded: boolean;  
}  

export const TreeNode: React.FC<TreeNodeProps> = ({   
    node,   
    level = 0,   
    onToggle,   
    isExpanded   
}) => {  
    const hasChildren = node.leaf && node.leaf.length > 0;  
    
    const nodeStyle: CSSProperties = {  
        paddingLeft: `${level * 20}px`,  
        cursor: hasChildren ? 'pointer' : 'default',  
        userSelect: 'none',  
        display: 'flex',  
        alignItems: 'center',  
        padding: '5px',  
    };  

    const toggleStyle: CSSProperties = {  
        marginRight: '5px',  
        fontSize: '12px',  
        visibility: hasChildren ? 'visible' : 'hidden'  
    };  

    return (  
        <div>  
            <div   
                style={nodeStyle}   
                onClick={hasChildren ? () => onToggle(node.root) : undefined}  
            >  
                <span style={toggleStyle}>  
                    {isExpanded ? '▼' : '►'}  
                </span>  
                {node.root}  
            </div>  
            {hasChildren && isExpanded && (  
                <div>  
                    {node.leaf?.map((childNode, index) => (  
                        // eslint-disable-next-line @typescript-eslint/no-unused-vars
                        <TreeNode   
                            key={`${node.root}-${index}`}  
                            node={childNode}   
                            level={level + 1}  
                            onToggle={onToggle}  
                            isExpanded={false} // 子节点默认不展开  
                        />  
                    ))}  
                </div>  
            )}  
        </div>  
    );  
};  

