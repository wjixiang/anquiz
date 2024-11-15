import React, { useState } from 'react';  
import * as quiztemplate from './interface/quizInterface';
import SingleSelectBox from './component/single_select_box';

type optionID = "A" | "B" | "C" | "D" | "E"  

export default class Quiz {  
    data: quiztemplate.quiz_format;  
    view: React.FC;  

    constructor(quiz_data: quiztemplate.quiz_format) {  
        this.data = quiz_data;  
        this.view = this.generateView();  
    }  

    private generateView(): React.FC {  
        switch (this.data.mode) {  
            case "A1":  
				return this.renderSingleQuestionQuiz();  	
            case "A2":  
				return this.renderSingleQuestionQuiz();  
            case "X":  
                return this.renderSingleQuestionQuiz();  
            case "A3":  
                return this.renderA3Quiz();  
            case "B":  
            case "E":  
                return this.renderBQuiz();  
            default:  
                return this.renderDefaultQuiz();  
        }  
    }  

	private renderSingleQuestionQuiz(): React.FC {  
		return () => {  
			const [selectedOption, setSelectedOption] = useState<string | null>(null);  
			const [isSubmitted, setIsSubmitted] = useState(false);  
			const [IsCorrect, setIsCorrect] = useState<boolean | undefined>(undefined);  
			const quizData = this.data as quiztemplate.quiz_A1 | quiztemplate.quiz_A2 | quiztemplate.quiz_X;  
	
			const handleOptionSelect = (option: optionID) => {  
				if (!isSubmitted) {  
					setSelectedOption(option);  
				}  
			};  
	
			const handleSubmit = () => {  
				if (selectedOption) {  
					const correctOption = quizData.qa.answer;  
					const isCorrect = selectedOption === correctOption;  
			
					console.log('选择的答案:', selectedOption);  
					console.log('正确答案:', correctOption);  
					console.log('是否正确:', isCorrect);  
			
					setIsSubmitted(true);  
					setIsCorrect(isCorrect);  
				}
			};  
	
			const handleReset = () => {  
				setSelectedOption(null);  
				setIsSubmitted(false);  
				setIsCorrect(undefined);  
			};  
	
			// 将选项映射到 optionID  
			const mapOptionToId = (option: string): optionID => {  
				const optionMap: {[key: string]: optionID} = {  
					[quizData.qa.options[0]]: 'A',  
					[quizData.qa.options[1]]: 'B',  
					[quizData.qa.options[2]]: 'C',  
					[quizData.qa.options[3]]: 'D',
					[quizData.qa.options[4]]: 'E',  
				};  
				return optionMap[option] || 'A';  
			};  
	
			return (  
				<div className="quiz-container">  
					<h2>{quizData.class}</h2>  
					<p>{quizData.qa.question}</p>  
					<div className="options">  
						{quizData.qa.options.map((option, index) => (   
							<SingleSelectBox  
								key={index}  
								groupid="quiz-group"  
								optionid={mapOptionToId(option)}  
								text={option}  
								onSelect={() => handleOptionSelect(mapOptionToId(option))}  
								isSelected={selectedOption === mapOptionToId(option)}  // 修改这里  
								isCorrect={quizData.qa.answer===selectedOption}  // 修改这里  
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
							<p className={IsCorrect ? 'text-green-500' : 'text-red-500'}>  
								{IsCorrect ? '回答正确！' : '回答错误'}  
							</p>  
							{!IsCorrect && (  
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
					{quizData.source && <p className="source">来源：{quizData.source}</p>}  
				</div>  
			);  
		};  
	}  
 

	private renderA3Quiz(): React.FC {  
        return () => {  
            const [selectedOptions, setSelectedOptions] = useState<{[key: number]: string}>({});  
            const [isSubmitted, setIsSubmitted] = useState(false);  
            const [correctness, setCorrectness] = useState<{[key: number]: boolean}>({});  
            const quizData = this.data as quiztemplate.quiz_A3;  

            const handleOptionSelect = (subIndex: number, option: string) => {  
                if (!isSubmitted) {  
                    setSelectedOptions(prev => ({  
                        ...prev,  
                        [subIndex]: option  
                    }));  
                }  
            };  

            const handleSubmit = () => {  
                const newCorrectness: {[key: number]: boolean} = {};  
                quizData.qa.subQA.forEach((subQuiz, index) => {  
                    newCorrectness[index] = selectedOptions[index] === subQuiz.answer;  
                });  
                setCorrectness(newCorrectness);  
                setIsSubmitted(true);  
            };  

            const handleReset = () => {  
                setSelectedOptions({});  
                setIsSubmitted(false);  
                setCorrectness({});  
            };  

            const allCorrect = isSubmitted &&   
                Object.values(correctness).every(correct => correct);  

            return (  
                <div className="quiz-container">  
                    <h2>{quizData.class}</h2>  
                    <h3>{quizData.qa.mainQ}</h3>  
                    <div className="sub-questions">  
                        {quizData.qa.subQA.map((subQuiz, index) => (  
                            <div key={index} className="sub-question">  
                                <p>{subQuiz.question}</p>  
                                <div className="options">  
                                    {subQuiz.options.map((option, optionIndex) => (  
                                        <button   
                                            key={optionIndex}  
                                            onClick={() => handleOptionSelect(index, option)}  
                                            className={`  
                                                ${selectedOptions[index] === option ? 'selected' : ''}  
                                                ${isSubmitted && selectedOptions[index] === option   
                                                    ? (correctness[index] ? 'correct' : 'incorrect')   
                                                    : ''}  
                                            `}  
                                            disabled={isSubmitted}  
                                        >  
                                            {option}  
                                        </button>  
                                    ))}  
                                </div>  
                                {isSubmitted && !correctness[index] && (  
                                    <p className="text-red-500">  
                                        正确答案是：{quizData.qa.mainQ}  
                                    </p>  
                                )}  
                            </div>  
                        ))}  
                    </div>  

                    {!isSubmitted && Object.keys(selectedOptions).length === quizData.qa.subQA.length && (  
                        <button   
                            onClick={handleSubmit}   
                            className="submit-btn"  
                        >  
                            提交答案  
                        </button>  
                    )}  

                    {isSubmitted && (  
                        <div className="result-section">  
                            <p className={allCorrect ? 'text-green-500' : 'text-red-500'}>  
                                {allCorrect ? '全部回答正确！' : '部分或全部回答错误'}  
                            </p>  
                            <button   
                                onClick={handleReset}   
                                className="reset-btn"  
                            >  
                                重新答题  
                            </button>  
                        </div>  
                    )}  
                    
                    {quizData.disc && <p className="description">{quizData.disc}</p>}  
                    {quizData.source && <p className="source">来源：{quizData.source}</p>}  
                </div>  
            );  
        };  
    }  

    private renderBQuiz(): React.FC {  
        return () => {  
            const quizData = this.data as quiztemplate.quiz_B | quiztemplate.quiz_E;  
            const [showAnswers, setShowAnswers] = useState(false);  

            return (  
                <div className="quiz-container">  
                    <h2>{quizData.class}</h2>  
                    <div className="questions">  
                        {quizData.q.map((question, index) => (  
                            <div key={index} className="question-answer-pair">  
                                <p className="question">{question}</p>  
                                {showAnswers && <p className="answer">{quizData.a[index]}</p>}  
                            </div>  
                        ))}  
                    </div>  
                    <button onClick={() => setShowAnswers(!showAnswers)}>  
                        {showAnswers ? '隐藏答案' : '显示答案'}  
                    </button>  
                    {quizData.disc && <p className="description">{quizData.disc}</p>}  
                    {quizData.source && <p className="source">来源：{quizData.source}</p>}  
                </div>  
            );  
        };  
    }  

    private renderDefaultQuiz(): React.FC {  
        return () => (  
            <div>  
                <p>未知的测验类型</p>  
            </div>  
        );  
    }  
}  
