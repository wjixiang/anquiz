import React, { Component } from "react";  
import { CheckIcon, XIcon } from 'lucide-react';  

type optionID = "A" | "B" | "C" | "D" | "E"  

interface SingleSelectBoxProps {  
    groupid: string,  
    optionid: optionID,  
    text: string,  
    isSelected?: boolean,  
    isCorrect?: boolean | undefined,  
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

    // 使用 static getDerivedStateFromProps 替代 componentDidUpdate  
    static getDerivedStateFromProps(nextProps: SingleSelectBoxProps, prevState: SingleSelectBoxState) {  
        const newState: Partial<SingleSelectBoxState> = {};  

        // 只在 props 实际变化时更新状态  
        if (nextProps.isSelected !== undefined && nextProps.isSelected !== prevState.checked) {  
            newState.checked = nextProps.isSelected;  
        }  

        if (nextProps.isCorrect !== undefined && nextProps.isCorrect !== (prevState.status === 'correct')) {  
            newState.status = nextProps.isCorrect ? "correct" : "wrong";  
        }  

        return Object.keys(newState).length > 0 ? newState : null;  
    }  

    handleClick = () => {  
        const { disabled, onSelect, optionid } = this.props;  

        if (disabled) return;  

        if (onSelect) {  
            onSelect(optionid);  
        }  

        // 移除本地状态切换，交由父组件控制  
        // this.setState(prevState => ({  
        //     checked: !prevState.checked  
        // }));  
    }  

    renderStatusIcon() {  
        const { status } = this.state;  
        
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
                <div className="mr-4">  
                    {this.renderStatusIcon()}  
                </div>  

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
