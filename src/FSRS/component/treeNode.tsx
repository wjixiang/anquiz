import React, {useState } from "react";  
import styled from "styled-components";  

// 类型定义保持不变  
export interface deckTree {  
    root: string;  
    leaf: deckTree[];  
    route: string[];  
}  

export interface deckProps {  
    deckTreeList: deckTree[];  
}  


// 样式组件  
const TreeNode = styled.div`  
  padding: 5px 0;  
`;  

const NodeContent = styled.div`  
  display: flex;  
  align-items: center;  
  cursor: pointer;  
  margin: 2px;  
  
  &:hover {  
    background-color: #f5f5f5;  
  }  
`;  

const ToggleIcon = styled.span`  
  margin-right: 2px;  
  width: 20px;  
  height: 20px;  
  display: inline-flex;  
  align-items: center;  
  justify-content: center;  
`;  

const ChildrenContainer = styled.div<{ level: number }>`  
  padding-left: ${props => props.level * 10}px;  
  border-left: 2px solid gray
`;  

const NodeBox = styled.div`  
  display: flex;
  align-items: center;
`;  

// 树节点组件  
export const TreeNodeComponent: React.FC<{  
  node: deckTree;  
  level: number;  
}> = ({ node, level }) => {  
  const [expanded, setExpanded] = useState(false);  
  const hasChildren = node.leaf && node.leaf.length > 0;  

  const handleToggle = () => {  
    if (hasChildren) {  
      setExpanded(!expanded);  
    }  
  };  

  return (  
    <TreeNode>  
	<NodeBox>
		<ToggleIcon onClick={handleToggle}>  
          {hasChildren && (expanded ? '-' : '+')}  
        </ToggleIcon> 
      <NodeContent>   
        <span>{node.root}</span>  
      </NodeContent>  
	</NodeBox>
      {hasChildren && expanded && (  
        <ChildrenContainer level={level}>  
          {node.leaf.map((child, index) => (  
            <TreeNodeComponent  
              key={`${child.root}-${index}`}  
              node={child}  
              level={level + 1}  
            />  
          ))}  
        </ChildrenContainer>  
      )}  
    </TreeNode>  
  );  
};  

// 主组件  
const deckTreeComponent: React.FC<deckProps> = ({ deckTreeList }) => {  
  return (  
    <div>  
      {deckTreeList.map((tree, index) => (  
        <TreeNodeComponent  
          key={`${tree.root}-${index}`}  
          node={tree}  
          level={1}  
        />  
      ))}  
    </div>  
  );  
};  

export default deckTreeComponent;
