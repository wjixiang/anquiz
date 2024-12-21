import styled from "styled-components";
import { obCard } from "../fsrs";
import { Card, fsrs, generatorParameters, RecordLogItem } from "ts-fsrs";
import { Notice } from "obsidian";
import { State } from "ts-fsrs";


export interface rateProps {
	currentCard: obCard;
	submitRate:(obcard:obCard,newCard:Card)=>Promise<obCard|null>;
}

const RatePanel:React.FC<rateProps> = (props)=>{	
	const {currentCard} = props
	
	if(currentCard.nid === ''){
		console.log("current",currentCard)
		return(
			<div>loading</div>
		)
	}

	const rating = async(newCard:Card)=>{
		props.submitRate(props.currentCard,newCard) 
			.then((obcard)=>{
				new Notice(`next appear: ${obcard?.card[obcard.card.length-1].due}`,2000)
				console.group()
				console.log(`update success: ${obcard?.nid}`)
				console.table(obcard)
				console.groupEnd()
			})
		
	}  

	const test_params = generatorParameters({ enable_fuzz: true, enable_short_term: false })
	const f = fsrs(test_params)
	const scheduling_cards = f.repeat(props.currentCard.card[props.currentCard.card.length-1],new Date())
	console.log(`log:`, scheduling_cards)

	return(
		<div>
			{Object.entries(scheduling_cards).map(([key,schedule])=>(
				<RateButton schedule={schedule} submitRate={rating} key={key}/>
			))}
		</div>
	)
}

function parseState(value: string): State | undefined {  
	return State[parseInt(value)] !== undefined ? parseInt(value) as State : undefined;  
  } 

const RateButton:React.FC<{
	key:string;
	schedule:RecordLogItem;
	submitRate:(newCard:Card)=>void;
}> = (props)=>{


	return(
		<RateButtonStyle onClick={()=>{
			const state = parseState(props.key)
			if(state){
				props.schedule.card.state=state
			}
			props.submitRate(props.schedule.card)
			}}>
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
