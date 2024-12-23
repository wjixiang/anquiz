import React, { useState } from 'react';  
import * as quizinterface from '../interface/quizInterface';
import SingleSelectBox from './single_select_box';

type optionID = "A" | "B" | "C" | "D" | "E"  

export default class Quiz<T extends quizinterface.quizMode,Y extends quizinterface.QAMode> {  
    data: quizinterface.quizModel<T,Y>;  
    view: React.FC;  

    constructor(quiz_data: quizinterface.quizModel<T,Y>) {  
        this.data = quiz_data;  
        this.view = this.generateView();  
    }  

    private generateView(): React.FC {  
        switch (this.data.mode) {  
            case "A1":  
				return this.renderSingleQuestionQuiz(this.data as quizinterface.quizModel<"A1",quizinterface.QA_single>);  	
            case "A2":  
				return this.renderSingleQuestionQuiz(this.data as quizinterface.quizModel<"A2",quizinterface.QA_single>);  
            case "X":  
				return this.renderSingleQuestionQuiz(this.data as quizinterface.quizModel<"A1",quizinterface.QA_single>);  
            case "A3":  
				return this.renderSingleQuestionQuiz(this.data as quizinterface.quizModel<"A1",quizinterface.QA_single>);    
            case "B":  
				return this.renderSingleQuestionQuiz(this.data as quizinterface.quizModel<"A1",quizinterface.QA_single>);  
            case "E":  
				return this.renderSingleQuestionQuiz(this.data as quizinterface.quizModel<"A1",quizinterface.QA_single>);   
            default:  
                return this.renderDefaultQuiz();  
        }  
    }  

	private renderSingleQuestionQuiz<T extends quizinterface.quizMode>(
		quizDataSingle:quizinterface.quizModel<T,quizinterface.QA_single>
	): React.FC {  
		return () => {  
			const [selectedOption, setSelectedOption] = useState<string | null>(null);  
			const [isSubmitted, setIsSubmitted] = useState(false);  
			const [isCorrect, setIsCorrect] = useState<boolean | undefined>(undefined);  
			const quizData = quizDataSingle
	
			const handleOptionSelect = (option: optionID) => {  
				if (!isSubmitted) {  
					setSelectedOption(option);  
				}  
			};  
	
			const handleSubmit = () => {  
				if (selectedOption) {  
					const correctOption = quizData.qa.answer;  
					const isCorrect = selectedOption === correctOption;  
			
					// console.log('select:', selectedOption);  
					// console.log('answer:', correctOption);  
					// console.log('right:', isCorrect);  
			
					setIsSubmitted(true);  
					setIsCorrect(isCorrect); 				
				}  
			};  
	
			const handleReset = () => {  
				setSelectedOption(null);  
				setIsSubmitted(false);  
			};  
	
			// 将选项映射到 optionID  
			const mapOptionToId = (option: string): optionID => {   
				if (  
					this.data.qa !== undefined &&   
					'options' in this.data.qa &&   
					Array.isArray(this.data.qa.options)  
				) {  
					const optionMap: {[key: string]: optionID} = {  
						[this.data.qa.options[0]]: 'A',  
						[this.data.qa.options[1]]: 'B',  
						[this.data.qa.options[2]]: 'C',  
						[this.data.qa.options[3]]: 'D',  
						[this.data.qa.options[4]]: 'E',  
					};  
					return optionMap[option] || 'A';  
				}  
				
				// 对于 QA_discourse 类型，返回默认值  
				return 'A';  
			};  

	
			// 判断单个选项是否正确  
			const isOptionCorrect = (option: string) => {  
				const correctOption = quizData.qa.answer;  
				const currentOptionId = option;  

				// console.log(correctOption,currentOptionId)
				return isSubmitted && (  
					(selectedOption === currentOptionId && currentOptionId === correctOption) || // 选中且正确  
					(selectedOption !== correctOption && currentOptionId === correctOption) // 未选中但是正确答案  
				);  
			};  
	
			// 判断单个选项是否错误  
			const isOptionWrong = (option: string) => {  
				const correctOption = quizData.qa.answer;  
				const currentOptionId = option;  
				const status = isSubmitted && (  
					(selectedOption === currentOptionId && currentOptionId !== correctOption) // 选中但错误  
				)
				return status;  
			};  
		
			return (  
				<div className="quiz-container">  
					<h2>{quizData.subject}</h2>  
					<p>{quizData.qa.question}</p>  
					<div className="options">  
						{quizData.qa.options.map((option, index) => (   
							<SingleSelectBox  
								key={index}  
								groupid="quiz-group"  
								optionid={mapOptionToId(option)}  
								text={option}  
								onSelect={() => handleOptionSelect(mapOptionToId(option))}  
								isSelected={selectedOption === mapOptionToId(option)}  
								isCorrect={isOptionCorrect(mapOptionToId(option)) ? true :   
										isOptionWrong(mapOptionToId(option)) ? false :   
										undefined}  
								disabled={isSubmitted}  
							/>  
						))}  
					</div>  
					
					{!isSubmitted && selectedOption && (  
						<button   
							onClick={handleSubmit}   
							className="submit-btn"  
						>  
							提交答案  
						</button>  
					)}  
	
					{isSubmitted && (  
						<div className="result-section">  
							<p className={isCorrect ? 'anquiz-text-green-500' : 'anquiz-text-red-500'}>  
								{isCorrect ? '回答正确！' : '回答错误'}  
							</p>  
							{selectedOption !== mapOptionToId(quizData.qa.answer) && (  
								<p>正确答案是：{quizData.qa.answer}</p>  
							)}  
							<button   
								onClick={handleReset}   
								className="reset-btn"  
							>  
								重新答题  
							</button>  
						</div>  
					)}  
					
					{quizData.disc && <p className="description">{quizData.disc}</p>}  
					
				</div>  
			);  
		};  
	}  
 

	// private renderA3Quiz(): React.FC {  
    //     return () => {  
    //         const [selectedOptions, setSelectedOptions] = useState<{[key: number]: string}>({});  
    //         const [isSubmitted, setIsSubmitted] = useState(false);  
    //         const [correctness, setCorrectness] = useState<{[key: number]: boolean}>({});  
    //         const quizData = this.data as quiztemplate.quiz_A3;  

    //         const handleOptionSelect = (subIndex: number, option: string) => {  
    //             if (!isSubmitted) {  
    //                 setSelectedOptions(prev => ({  
    //                     ...prev,  
    //                     [subIndex]: option  
    //                 }));  
    //             }  
    //         };  

    //         const handleSubmit = () => {  
    //             const newCorrectness: {[key: number]: boolean} = {};  
    //             quizData.qa.subQA.forEach((subQuiz, index) => {  
    //                 newCorrectness[index] = selectedOptions[index] === subQuiz.answer;  
    //             });  
    //             setCorrectness(newCorrectness);  
    //             setIsSubmitted(true);  
    //         };  

    //         const handleReset = () => {  
    //             setSelectedOptions({});  
    //             setIsSubmitted(false);  
    //             setCorrectness({});  
    //         };  

    //         const allCorrect = isSubmitted &&   
    //             Object.values(correctness).every(correct => correct);  

    //         return (  
    //             <div className="quiz-container">  
    //                 <h2>{quizData.class}</h2>  
    //                 <h3>{quizData.qa.mainQ}</h3>  
    //                 <div className="sub-questions">  
    //                     {quizData.qa.subQA.map((subQuiz, index) => (  
    //                         <div key={index} className="sub-question">  
    //                             <p>{subQuiz.question}</p>  
    //                             <div className="options">  
    //                                 {subQuiz.options.map((option, optionIndex) => (  
    //                                     <button   
    //                                         key={optionIndex}  
    //                                         onClick={() => handleOptionSelect(index, option)}  
    //                                         className={`  
    //                                             ${selectedOptions[index] === option ? 'selected' : ''}  
    //                                             ${isSubmitted && selectedOptions[index] === option   
    //                                                 ? (correctness[index] ? 'correct' : 'incorrect')   
    //                                                 : ''}  
    //                                         `}  
    //                                         disabled={isSubmitted}  
    //                                     >  
    //                                         {option}  
    //                                     </button>  
    //                                 ))}  
    //                             </div>  
    //                             {isSubmitted && !correctness[index] && (  
    //                                 <p className="text-red-500">  
    //                                     正确答案是：{quizData.qa.mainQ}  
    //                                 </p>  
    //                             )}  
    //                         </div>  
    //                     ))}  
    //                 </div>  

    //                 {!isSubmitted && Object.keys(selectedOptions).length === quizData.qa.subQA.length && (  
    //                     <button   
    //                         onClick={handleSubmit}   
    //                         className="submit-btn"  
    //                     >  
    //                         提交答案  
    //                     </button>  
    //                 )}  

    //                 {isSubmitted && (  
    //                     <div className="result-section">  
    //                         <p className={allCorrect ? 'text-green-500' : 'text-red-500'}>  
    //                             {allCorrect ? '全部回答正确！' : '部分或全部回答错误'}  
    //                         </p>  
    //                         <button   
    //                             onClick={handleReset}   
    //                             className="reset-btn"  
    //                         >  
    //                             重新答题  
    //                         </button>  
    //                     </div>  
    //                 )}  
                    
    //                 {quizData.disc && <p className="description">{quizData.disc}</p>}  
    //                 {quizData.source && <p className="source">来源：{quizData.source}</p>}  
    //             </div>  
    //         );  
    //     };  
    // }  

    // private renderBQuiz(): React.FC {  
    //     return () => {  
    //         const quizData = this.data as quiztemplate.quiz_B | quiztemplate.quiz_E;  
    //         const [showAnswers, setShowAnswers] = useState(false);  

    //         return (  
    //             <div className="quiz-container">  
    //                 <h2>{quizData.class}</h2>  
    //                 <div className="questions">  
    //                     {quizData.q.map((question, index) => (  
    //                         <div key={index} className="question-answer-pair">  
    //                             <p className="question">{question}</p>  
    //                             {showAnswers && <p className="answer">{quizData.a[index]}</p>}  
    //                         </div>  
    //                     ))}  
    //                 </div>  
    //                 <button onClick={() => setShowAnswers(!showAnswers)}>  
    //                     {showAnswers ? '隐藏答案' : '显示答案'}  
    //                 </button>  
    //                 {quizData.disc && <p className="description">{quizData.disc}</p>}  
    //                 {quizData.source && <p className="source">来源：{quizData.source}</p>}  
    //             </div>  
    //         );  
    //     };  
    // }  

    private renderDefaultQuiz(): React.FC {  
        return () => (  
            <div>  
                <p>未知的测验类型</p>  
            </div>  
        );  
    }  
}  
