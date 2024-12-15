import { deckTree, schedule } from './treeNode';
import React, {useEffect, useState}from "react"  
import styled from "styled-components";  
import { ArrowLeft, BookOpen } from 'lucide-react';  
import { obCard } from '../fsrs';
import ScheduleStatus from './ScheduleStatus';
import LearnArea from './learnArea';
import RatePanel from './ratePanel';
import {  Card } from 'ts-fsrs';

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

export interface sortMethod{
	newLearnSortMethod: (cards:obCard[])=>obCard[]
}

export const FsrsStudy: React.FC<{  
    deck: deckTree | null;
    backHome: () => void;
	sortMethod: sortMethod;
	getFileName: (nid:string)=>Promise<string>;
	redirect: (nid:string)=>void;
	submitRate:(obcard:obCard,newCard:Card)=>Promise<obCard|null>;
	updateSchedule:(deck:string[])=>Promise<schedule>
}> = (props) => {  
    const deckPath = props.deck ? props.deck.route.join(' / ') : '';  
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const [schedule,setSchedule] = useState(props.deck?.schedule|| {
		newLearn: [],  
        studying: [],  
        review: []  
	})

	const initObCard:obCard = {
		nid: '',
		card: [],
		deck: []
	}
 
	
	const [currentCard,setCurrentCard] = useState<obCard>(initObCard)

	useEffect(()=>{
		const next = async()=>{
			if(props.deck?.route){
				setSchedule(await props.updateSchedule(props.deck.route))
			}
			const sortedNewLearn = props.sortMethod.newLearnSortMethod(schedule.newLearn)
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			const sortedReview = props.sortMethod.newLearnSortMethod(schedule.newLearn)
			console.table(sortedNewLearn)
	
			setCurrentCard(sortedNewLearn[0])// temporary
		}
		next()
	},[props.deck])

	if(currentCard.nid===''){
		return(<div>

		</div>)
	}

    return (  
		<div>
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

			<LearnArea currentCard={currentCard} getFileName={props.getFileName} redirect={props.redirect}  />
			<RatePanel currentCard={currentCard} submitRate={props.submitRate}/>
		</div> 
    )  
}
