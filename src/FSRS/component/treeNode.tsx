import React, {useState } from "react";  
import styled from "styled-components";  
import { obCard } from "../fsrs";


export interface schedule{
	newLearn: obCard[];
	studying: obCard[];
	review: obCard[];
}

// 类型定义保持不变  
export interface deckTree {  
    root: string;  
    leaf: deckTree[];  
    route: string[];  
	schedule: schedule
}  

export interface deckProps {  
    deckTreeList: deckTree[];  
	openSchedule: (deckTree:deckTree,update:()=>void)=>void;
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
//padding-left: ${props => props.level * 10}px;
const ChildrenContainer = styled.div<{ level: number }>`  
  padding-left: 10px;  
  border-left: 2px solid gray
`;  

const NodeBox = styled.div`  
  display: flex;
  align-items: center;
  width: 100%
`;  

const ScheduleDisplay = styled.div`  
  display: flex;
  padding: 5px 0;  
`;  

const ScheduleNumber = styled.div<{color: string}>`
	color: ${props=>props.color};
	text-align: center;
	padding: 2px
`;


// 树节点组件  
export const TreeNodeComponent: React.FC<{  
  node: deckTree;  
  level: number;  
  openSchedule: (deckTree:deckTree,update:()=>void)=>void
}> = ({ node, level ,openSchedule }) => {  
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
      <NodeContent onClick={()=>openSchedule(node,()=>{console.log(`open deck ${node.root}`)})}>   
        <span>{node.root}</span> 
		<ScheduleDisplay>
			<ScheduleNumber color="blue">{node.schedule.newLearn.length}</ScheduleNumber>	
			<ScheduleNumber color="red">{node.schedule.studying.length}</ScheduleNumber>
			<ScheduleNumber color="green">{node.schedule.review.length}</ScheduleNumber>
		</ScheduleDisplay>
      </NodeContent>  
	</NodeBox>
      {hasChildren && expanded && (  
        <ChildrenContainer level={level}>  
          {node.leaf.map((child, index) => (  
            <TreeNodeComponent  
              key={`${child.root}-${index}`}  
              node={child}  
            level={level + 1}  
				openSchedule = {openSchedule}
            />  
          ))}  
        </ChildrenContainer>  
      )}  
    </TreeNode>  
  );  
};  

// 主组件  
const deckTreeComponent: React.FC<deckProps> = ({ deckTreeList,	openSchedule} )=> {  
  return (  
    <div>  
      {deckTreeList.map((tree, index) => (  
        <TreeNodeComponent  
          key={`${tree.root}-${index}`}  
          node={tree}  
          level={1}  
		openSchedule={openSchedule}
        />  
      ))}  
    </div>  
  );  
};  

export default deckTreeComponent;
