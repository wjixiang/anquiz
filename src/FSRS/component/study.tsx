import { deckTree, schedule } from './treeNode';
import React, {useState}from "react"  
import styled from "styled-components";  
import { ArrowLeft, BookOpen } from 'lucide-react';  

const HeadControl = styled.div`  
    display: flex;  
    align-items: center;  
    justify-content: space-between;  
    padding: 10px 15px;  
    border-bottom: 1px solid #e9ecef;  
    box-shadow: 0 2px 4px rgba(0,0,0,0.05);  
`  

const ControlLeft = styled.div`  
    display: flex;  
    align-items: center;  
`  

const ControlCenter = styled.div`  
    display: flex;  
    align-items: center;  
    font-weight: 600;  
`  

const ControlRight = styled.div`  
    display: flex;  
    align-items: center;  
    gap: 10px;  
`  

const IconButton = styled.button`  
    background: none;  
    border: none;  
    cursor: pointer;  
    display: flex;  
    align-items: center;  
    justify-content: center;  
    padding: 5px;  
    border-radius: 4px;  
    transition: background-color 0.2s ease;  

    &:hover {  
        background-color: #e9ecef;  
    }  

    svg {  
        stroke-width: 1.5;  
    }  
`  

const DeckTitle = styled.div`  
    margin-left: 15px;  
    font-size: 16px;  
`  

export const FsrsStudy: React.FC<{  
    deck: deckTree | null,   
    backHome: () => void,
}> = (props) => {  
    const deckPath = props.deck ? props.deck.route.join(' / ') : '';  
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const [schedule,setSchedule] = useState(props.deck?.schedule|| {
		newLearn: [],  
        studying: [],  
        review: []  
	})
    return (  
        <HeadControl>  
            <ControlLeft>  
                <IconButton onClick={props.backHome} title="返回卡组">  
                    <ArrowLeft size={20} />  
                </IconButton>  
                <DeckTitle>{deckPath}</DeckTitle>  
            </ControlLeft>  

            <ControlCenter>  
                <IconButton title="学习进度">  
                    <BookOpen size={20} />  
                </IconButton>  
            </ControlCenter>  

            <ControlRight>  
				<ScheduleStatus schedule={schedule}/>
            </ControlRight>  
        </HeadControl>  
    )  
}

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
