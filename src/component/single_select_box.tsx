import React, { Component } from "react";  
import { CheckIcon, XIcon } from 'lucide-react'; // 使用 lucide-react 图标库  

type optionID = "A" | "B" | "C" | "D" | "E"  

interface SingleSelectBoxProps {  
    groupid: string,  
    optionid: optionID,  
    text: string,  
    isSelected?: boolean,  
    isCorrect?: boolean,  
    onSelect?: (optionid: optionID) => void,  
    disabled?: boolean  
}  

interface SingleSelectBoxState {  
    checked: boolean,  
    status: "correct" | "wrong" | "unknown"  
}  

export default class SingleSelectBox extends Component<SingleSelectBoxProps, SingleSelectBoxState> {  
    constructor(props: SingleSelectBoxProps) {  
        super(props);  
        this.state = {  
            checked: props.isSelected || false,  
            status: "unknown"  
        };  
    }  

    componentDidUpdate(prevProps: SingleSelectBoxProps) {  
        if (prevProps.isSelected !== this.props.isSelected) {  
            this.setState({  
                checked: !!this.props.isSelected  
            });  
        }  

        if (this.props.isCorrect !== undefined) {  
            this.setState({  
                status: this.props.isCorrect ? "correct" : "wrong"  
            });  
        }  
    }  

    handleClick = () => {  
        const { disabled, onSelect, optionid } = this.props;  

        if (disabled) return;  

        if (onSelect) {  
            onSelect(optionid);  
        }  

        this.setState(prevState => ({  
            checked: !prevState.checked  
        }));  
    }  

    renderStatusIcon() {  
        const { status } = this.state;  
        
        // 根据状态渲染不同的图标和颜色  
        switch (status) {  
            case "correct":  
                return (  
                    <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">  
                        <CheckIcon className="text-white w-5 h-5" />  
                    </div>  
                );  
            case "wrong":  
                return (  
                    <div className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center">  
                        <XIcon className="text-white w-5 h-5" />  
                    </div>  
                );  
            default:  
                return (  
                    <div className={`  
                        w-8 h-8 rounded-full   
                        ${this.state.checked ? 'bg-blue-500' : 'bg-gray-300'}  
                        flex items-center justify-center  
                    `}>  
                        {this.state.checked && (  
                            <span className="text-white text-sm">✓</span>  
                        )}  
                    </div>  
                );  
        }  
    }  

    render() {  
        const { optionid, text, disabled } = this.props;  
        const { checked, status } = this.state;  

        return (  
            <div   
                className={`  
                    flex items-center   
                    border rounded-lg   
                    m-2 p-2   
                    transition-all duration-300   
                    ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:bg-blue-500'}  
                    ${checked ? 'border-blue-500' : 'border-gray-300'}  
                    ${status === 'correct' ? 'border-green-500' : ''}  
                    ${status === 'wrong' ? 'border-red-500' : ''}  
                `}  
                onClick={this.handleClick}  
                id={optionid}  
            >  
                {/* 左侧状态图标 */}  
                <div className="mr-4">  
                    {this.renderStatusIcon()}  
                </div>  

                {/* 选项文本 */}  
                <div className={`  
                    flex-grow   
                    ${checked ? 'font-semibold' : 'font-normal'}  
                    ${status === 'correct' ? 'text-green-700' : ''}  
                    ${status === 'wrong' ? 'text-red-700' : ''}  
                `}>  
                    {text}  
                </div>  
            </div>  
        );  
    }  
}
