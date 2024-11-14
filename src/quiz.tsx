import React, { useState } from 'react';  
import * as quiztemplate from './interface/quizInterface';


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
            const [isCorrect, setIsCorrect] = useState<boolean | null>(null);  
            const quizData = this.data as quiztemplate.quiz_A1 | quiztemplate.quiz_A2 | quiztemplate.quiz_X;  

            const handleOptionSelect = (option: string) => {  
                if (!isSubmitted) {  
                    setSelectedOption(option);  
                }  
            };  

            const handleSubmit = () => {  
                if (selectedOption) {  
                    setIsSubmitted(true);  
                    // 假设答案存储在 quizData.qa.answer 中  
                    setIsCorrect(selectedOption === quizData.qa.answer);  
                }  
            };  

            const handleReset = () => {  
                setSelectedOption(null);  
                setIsSubmitted(false);  
                setIsCorrect(null);  
            };  

            return (  
                <div className="quiz-container">  
                    <h2>{quizData.class}</h2>  
                    <p>{quizData.qa.question}</p>  
                    <div className="options">  
                        {quizData.qa.options.map((option, index) => ( 
                            <button   
                                key={index}  
                                onClick={() => handleOptionSelect(option)}  
                                className={`  
                                    ${selectedOption === option ? 'selected' : ''}  
                                    ${isSubmitted && selectedOption === option   
                                        ? (isCorrect ? 'correct' : 'incorrect')   
                                        : ''}  
                                `}  
                                disabled={isSubmitted}  
                            >  
                                {option}  
                            </button>  
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
                            <p className={isCorrect ? 'text-green-500' : 'text-red-500'}>  
                                {isCorrect ? '回答正确！' : '回答错误'}  
                            </p>  
                            {!isCorrect && (  
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
                                        正确答案是：{subQuiz.answer}  
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
