import React, { Component } from "react";  

type optionID = "A" | "B" | "C" | "D" | "E"  

interface SingleSelectBoxProps {  
    groupid: string,  
    optionid: optionID,  
    text: string,  
    // 新增属性  
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
    // 默认构造函数  
    constructor(props: SingleSelectBoxProps) {  
        super(props);  
        this.state = {  
            checked: props.isSelected || false,  
            status: "unknown"  
        };  
    }  

    // 组件更新时同步外部传入的选中状态  
    componentDidUpdate(prevProps: SingleSelectBoxProps) {  
        if (prevProps.isSelected !== this.props.isSelected) {  
            this.setState({  
                checked: !!this.props.isSelected  
            });  
        }  

        // 同步正确性状态  
        if (this.props.isCorrect !== undefined) {  
            this.setState({  
                status: this.props.isCorrect ? "correct" : "wrong"  
            });  
        }  
    }  

    // 处理点击事件  
    handleClick = () => {  
        const { disabled, onSelect, optionid } = this.props;  

        // 如果被禁用，不响应点击  
        if (disabled) return;  

        // 调用外部传入的选择处理函数  
        if (onSelect) {  
            onSelect(optionid);  
        }  

        // 更新本地状态（如果没有外部控制）  
        this.setState(prevState => ({  
            checked: !prevState.checked  
        }));  
    }  

    // 渲染方法  
    render() {  
        const { optionid, text } = this.props;  
        const { checked, status } = this.state;  

        // 根据状态确定样式类  
        const getClassName = () => {  
            let baseClass = "single-select-box";  
            
            if (this.props.disabled) {  
                baseClass += " disabled";  
            }  

            if (checked) {  
                baseClass += " selected";  
            }  

            if (status === "correct") {  
                baseClass += " correct";  
            } else if (status === "wrong") {  
                baseClass += " wrong";  
            }  

            return baseClass;  
        }  

        return (  
            <div   
                className={`${getClassName()} border-l-2 border-green-50 m-2 p-2`}   
                onClick={this.handleClick}  
				id={optionid}
            >   
                <div className="option-text">{text}</div>  
            </div>  
        );  
    }  
}  
