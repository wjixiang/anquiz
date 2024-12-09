import styled from "styled-components";
// import { useEffect, useState } from "react";

import { obCard } from "../fsrs";
import { fsrs, generatorParameters, RecordLogItem } from "ts-fsrs";


export interface rateProps {
	currentCard: obCard;
	rater: (card:obCard)=>object;
}

const RatePanel:React.FC<rateProps> = (props)=>{	
	const {currentCard} = props
	
	if(currentCard.nid === ''){
		console.log("current",currentCard)
		return(
			<div>loading</div>
		)
	}

	const test_params = generatorParameters({ enable_fuzz: true, enable_short_term: false })
	const f = fsrs(test_params)
	const scheduling_cards = f.repeat(props.currentCard.card[props.currentCard.card.length-1],new Date())

	return(
		<div>
			{Object.values(scheduling_cards).map((schedule:RecordLogItem)=>(
				<RateButton schedule={schedule} />
			))}
		</div>
	)
}



const RateButton:React.FC<{
	schedule:RecordLogItem;
	// submitRate:()=>void;
}> = (props)=>{
	return(
		<RateButtonStyle>
			{props.schedule.card.due.toString()}
		</RateButtonStyle>
	)
}

const RateButtonStyle = styled.div`  
	margin: 5px;
	padding: 10px;  
	border: 2px #e9ecef solid;
	&:hover {  
    background: grey
  }  
`; 

export default RatePanel
