import * as React from 'react';
import styles from './Confirmation.module.scss';

import { Checkbox, ICheckboxStyles } from '@fluentui/react';
import { IConfirmationProps } from './IConfirmationProps';


export default class Confirmation extends React.Component<IConfirmationProps, {}> {

    public _onChange(ev?: React.FormEvent<HTMLElement | HTMLInputElement>, isChecked?: boolean) {
    }

    public render(): React.ReactElement<IConfirmationProps> {
        const {
            confirmed,
            editMode,
            confirmText,
            theme,
            darkTheme
        } = this.props;

        // const handleMessageChange = event => {
        //     // 👇️ access textarea value
        //     const element: any = document.getElementById("textArea1");
        //     if(!event.target.value && this.props.editMode === 2){
        //         element.style.display = 'none';
        //     } else {
        //         element.style.display = 'block'
        //     }
        //   };

        let defaultStyles: ICheckboxStyles;

        if (this.props.darkTheme) {

            defaultStyles = {
                root: [
                    {
                        border: 'none',
                        left: "-3px"
                    }
                ],
                checkbox: [
                    {
                        borderColor: "#ffffff",
                        color: this.props.theme.semanticColors.primaryButtonText,
                        width: '20px',
                        height: '20px',
                    }
                ],
                checkmark: [
                    {
                        fontSize: "20px",
                        color: "#ffffff"
                    }
                ],
                label: [
                    {
                        color: "#ffffff",
                        float: 'right',
                        fontSize: "14px",
                        marginLeft: "6px",
                        fontWeight: "400",
                        paddingRight: "36px",
                    }
                ],
                text: [
                    {
                        maxWidth: "430px"
                    }
                ]
            };
        }
        else {
            defaultStyles = {
                root: [
                    {
                        border: 'none',
                        left: "-3px"
                    }
                ],
                checkbox: [
                    {
                        color: this.props.theme.semanticColors.primaryButtonText,
                        width: '20px',
                        height: '20px',
                    }
                ],
                checkmark: [
                    {
                        color: this.props.theme.semanticColors.primaryButtonText,
                        fontSize: "20px"
                    }
                ],
                label: [
                    {
                        color: "#ffffff",
                        float: 'right',
                        fontSize: "14px",
                        marginLeft: "6px",
                        fontWeight: "400",
                        paddingRight: "36px",
                    }
                ],
                text: [{
                    maxWidth: "430px"
                }]
            };
        }

        const element: any = document.getElementById("textArea1");

        if (element && element.value === '') {
            element.style.display = 'none';
        }
        if (this.props.editMode === 2 && element) {
            element.style.display = 'block';
        }

        return (
            <>
                <div>{false
                    ? <div></div>
                    :
                    <>
                        <textarea id="textArea1" className={styles.textArea} placeholder={(this.props.editMode === 2) ? "Potwierdzanie informacji" : ""} rows={1} aria-label="Add a title" readOnly={!(this.props.editMode === 2)}></textarea>
                        <div className={styles.confirm}>
                            {/* {this.props.confirmed ? <Checkbox label={this.props.confirmText || "Dodaj informacje, które należy potwierdzić do listy."} checked={this.props.confirmed} defaultChecked onChange={this._onChange} disabled={true}/> : <Checkbox label={this.props.confirmText || "Dodaj informacje, które należy potwierdzić do listy."} defaultIndeterminate  defaultChecked onChange={this._onChange}/>} */}
                            {/* <div className={styles.text}>{this.props.confirmText || "Dodaj informacje, które należy potwierdzić do listy."}</div> */}
                            <Checkbox styles={defaultStyles} label={this.props.confirmText || "Dodaj informacje, które należy potwierdzić do listy."} defaultChecked={this.props.confirmed || false} disabled={this.props.confirmed || false} />
                        </div>
                    </>
                }</div>
            </>
        );
    }
}