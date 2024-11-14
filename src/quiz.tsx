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
            case "A2":  
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
            const quizData = this.data as quiztemplate.quiz_A1 | quiztemplate.quiz_A2 | quiztemplate.quiz_X;  

            const handleOptionSelect = (option: string) => {  
                setSelectedOption(option);  
            };  

            return (  
                <div className="quiz-container">  
                    <h2>{quizData.class}</h2>  
                    <p>{quizData.qa.question}</p>  
                    <div className="options">  
                        {quizData.qa.option.map((option, index) => (  
                            <button   
                                key={index}  
                                onClick={() => handleOptionSelect(option)}  
                                className={selectedOption === option ? 'selected' : ''}  
                            >  
                                {option}  
                            </button>  
                        ))}  
                    </div>  
                    {quizData.disc && <p className="description">{quizData.disc}</p>}  
                    {quizData.source && <p className="source">来源：{quizData.source}</p>}  
                </div>  
            );  
        };  
    }  

    private renderA3Quiz(): React.FC {  
        return () => {  
            const [selectedOptions, setSelectedOptions] = useState<{[key: number]: string}>({});  
            const quizData = this.data as quiztemplate.quiz_A3;  

            const handleOptionSelect = (subIndex: number, option: string) => {  
                setSelectedOptions(prev => ({  
                    ...prev,  
                    [subIndex]: option  
                }));  
            };  

            return (  
                <div className="quiz-container">  
                    <h2>{quizData.class}</h2>  
                    <h3>{quizData.qa.mainQ}</h3>  
                    <div className="sub-questions">  
                        {quizData.qa.subQA.map((subQuiz, index) => (  
                            <div key={index} className="sub-question">  
                                <p>{subQuiz.question}</p>  
                                <div className="options">  
                                    {subQuiz.option.map((option, optionIndex) => (  
                                        <button   
                                            key={optionIndex}  
                                            onClick={() => handleOptionSelect(index, option)}  
                                            className={selectedOptions[index] === option ? 'selected' : ''}  
                                        >  
                                            {option}  
                                        </button>  
                                    ))}  
                                </div>  
                            </div>  
                        ))}  
                    </div>  
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
