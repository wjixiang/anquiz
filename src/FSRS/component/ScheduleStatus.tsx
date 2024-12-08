import styled from "styled-components";
import { schedule } from "./treeNode"

const ScheduleDisplay = styled.div`  
  display: flex;
  padding: 5px 0;  
`;  

const ScheduleNumber = styled.div<{color: string}>`
	color: ${props=>props.color};
	text-align: center;
	padding: 2px;
	margin: 1px;
	border: 1px solid #272A36;
	background-color: #363636; 
	box-shadow: 0 2px 4px rgba(0,0,0,0.05); 
`;



const ScheduleStatus:React.FC<{schedule:schedule}> = (props)=>{
	return(
		<ScheduleDisplay>
			<ScheduleNumber color="#84C7FF">{props.schedule.newLearn.length}</ScheduleNumber>	
			<ScheduleNumber color="red">{props.schedule.studying.length}</ScheduleNumber>
			<ScheduleNumber color="green">{props.schedule.review.length}</ScheduleNumber>
		</ScheduleDisplay>
	)

}

export default ScheduleStatus
