import React, { Component } from "react";
import { CheckIcon, XIcon } from 'lucide-react';
// import './single-select-box.css';

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

    static getDerivedStateFromProps(nextProps: SingleSelectBoxProps, prevState: SingleSelectBoxState) {
        const newState: Partial<SingleSelectBoxState> = {};

        if (nextProps.isSelected !== undefined && nextProps.isSelected !== prevState.checked) {
            newState.checked = nextProps.isSelected;
        }

        if (nextProps.isCorrect !== undefined) {
            // console.log(nextProps.isCorrect)
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
    }

    renderStatusIcon() {
        const { status } = this.state;
        
        switch (status) {
            case "correct":
                return (
                    <div className="anquiz-select-box__status-icon anquiz-select-box__status-icon--correct">
                        <CheckIcon className="anquiz-select-box__status-icon-check" />
                    </div>
                );
            case "wrong":
                return (
                    <div className="anquiz-select-box__status-icon anquiz-select-box__status-icon--wrong">
                        <XIcon className="anquiz-select-box__status-icon-check" />
                    </div>
                );
            default:
                return (
                    <div className={`
                        anquiz-select-box__status-icon 
                        anquiz-select-box__status-icon--unchecked
                        ${this.state.checked ? 'anquiz-checked' : ''}
                    `}>
                        {this.state.checked && (
                            <span className="anquiz-select-box__status-icon-text">✓</span>
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
                    anquiz-select-box
                    ${disabled ? 'anquiz-disabled' : ''}
                    ${checked ? 'anquiz-checked' : ''}
                    ${status === 'correct' ? 'anquiz-correct' : ''}
                    ${status === 'wrong' ? 'anquiz-wrong' : ''}
                `}
                onClick={this.handleClick}
                id={optionid}
            >
                <div>
                    {this.renderStatusIcon()}
                </div>

                <div className={`
                    anquiz-select-box__text
                    ${checked ? 'anquiz-checked' : ''}
                    ${status === 'correct' ? 'anquiz-correct' : ''}
                    ${status === 'wrong' ? 'anquiz-wrong' : ''}
                `}>
                    {text}
                </div>
            </div>
        );
    }
}
