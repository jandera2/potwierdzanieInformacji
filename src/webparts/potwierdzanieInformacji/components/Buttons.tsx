import * as React from 'react';
import cssStyles from './Buttons.module.scss';
import styles from './Confirmation.module.scss';

import { IButtonsProps } from './IButtonsProps';
import { DefaultButton, IButtonStyles, PrimaryButton } from '@fluentui/react/lib/Button';

import { ContextualMenu, IContextualMenuProps, IIconProps, ILabelStyles } from '@fluentui/react';
import { } from '@fluentui/react';
import { getElementFromList } from '../functions/functions';

import { initializeIcons } from '@fluentui/font-icons-mdl2';
import PotwierdzanieInformacjiWebPart from '../PotwierdzanieInformacjiWebPart';
import PotwierdzanieInformacji from './PotwierdzanieInformacji';

import { Checkbox, ICheckboxStyles, Label } from '@fluentui/react';
import { LeafThree16Filled } from '@fluentui/react-icons';
import { SPHttpClient } from '@microsoft/sp-http';

initializeIcons();


export default class Buttons extends React.Component<IButtonsProps, {}> {

    state = {
        choosenDef: {
            id: this.props.choosenDef,
            status: false,
            checkboxState: false
        },
        checkStatus: true,
        btnText: ''
    }

    postItems = (props, approvalText, context) => {

        const apiLink = `${props.confirmListUrl}/_api/lists/GetByTitle('${props.confirmListName}')/items?expand=fields`;
    
        if (!apiLink || !props.confirmListUrl || !props.confirmListName|| !props.choosenDef) {
    
            return;
    
        } else {
    
    
            let req = context.spHttpClient.post(
    
                `${props.confirmListUrl}/_api/lists/GetByTitle('${props.confirmListName}')/items`,
    
                SPHttpClient.configurations.v1,
                {
                    body: JSON.stringify({
                        "Title": props.context.pageContext.user.email,
                        "ConsentDefId": props.choosenDef,
                        "ConsentText": approvalText
                    })  
                }
            ).then(() => {
                this.setState({ choosenDef: { checkboxState: true } });
            }).then(()=>{
                this.setState({ checkStatus: true });
            });
        }
    
    }

    handleChange = (event) => {

        this.setState({ choosenDef: {checkboxState: event.target.checked }});

    };


    handleTextAreaChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    }

    async componentDidUpdate(prevProps, prevState) {

        console.log("update");

        if ((this.state !== prevState && this.state.checkStatus) || this.props !== prevProps) {

            getElementFromList(this.props.confirmListUrl, this.props.confirmListName, this.props.choosenDef, this.props.context.pageContext.user.email).then((defStatus) => {

                if (defStatus === undefined) defStatus = true;

                this.setState({ choosenDef: { Id: this.props.choosenDef, status: defStatus, checkboxState: defStatus }, checkStatus: false });
        
                this.render();
            });

        }

    }

    async componentDidMount() {

        console.log("mount");

        let defStatus = await getElementFromList(this.props.confirmListUrl, this.props.confirmListName, this.props.choosenDef, this.props.context.pageContext.user.email);

        if (defStatus === undefined) defStatus = true;

        this.setState({ choosenDef: { Id: this.props.choosenDef, status: defStatus, checkboxState: defStatus }});

        this.setState({ checkStatus: false });

        this.render();
    }

    public render(): React.ReactElement<IButtonsProps> {

        const {
            title,
            listUrl,
            listName,
            choosenDef,

            confirmListUrl,
            confirmListName,

            confirmBtnText,
            afterConfirmBtnText,

            addBtnText,
            addBtnLink,
            moreButtonVisible,
            editMode,
            context,
            confirmText,
            confirmed,
            darkTheme,
            theme,
            textAreaValue
        } = this.props;

        let primaryStyles: IButtonStyles;

        let primaryDisabledStyles: IButtonStyles;

        let defaultStyles: IButtonStyles;

        let checkboxStyles: ICheckboxStyles;

        let confirmedCheckboxStyles: ICheckboxStyles;

        let labelStyles: ILabelStyles;
        
        let checkboxStatus = false;

        if (this.props.darkTheme) {

            primaryStyles = {
                root: [
                    {
                        backgroundColor: this.props.theme.palette.themePrimary,
                        //border: `1px solid ${this.props.theme.palette.themePrimary}`,
                        borderSize: "1px",
                        borderStyle: "solid",
                        borderColor: this.props.theme.palette.themePrimary,
                        borderRadius: '2px',
                        color: this.props.theme.palette.white,//'#ffffff',//this.props.theme.palette.white,
                        fontSize: '14px',
                        fontWeight: '600'                    
                    }
                ],
                rootCheckedDisabled: [
                    {
                        // backgroundColor: this.props.theme.palette.themePrimary,
                        // border: `1px solid ${this.props.theme.palette.themePrimary}`,
                        // borderRadius: '2px',
                        // color: this.props.theme.palette.white,//'#ffffff',//this.props.theme.palette.white,
                        // fontSize: '14px',
                        // fontWeight: '600'   
                        fontSize: '14px',
                        fontWeight: '600',
                        backgroundColor: "#f3f2f1",//this.props.theme.palette.neutralQuaternaryAlt,
                        border: "1px solid #f3f2f1",
                        borderRadius: '2px',
                        color: "#a19f9d",//this.props.theme.palette.neutralTertiary
     
                    }
                ],
                rootChecked: [
                    {
                        // backgroundColor: this.props.theme.palette.themePrimary,
                        // border: `1px solid ${this.props.theme.palette.themePrimary}`,
                        // borderRadius: '2px',
                        // color: this.props.theme.palette.white,//'#ffffff',//this.props.theme.palette.white,
                        // fontSize: '14px',
                        // fontWeight: '600'        
                        fontSize: '14px',
                        fontWeight: '600',
                        backgroundColor: "#f3f2f1",//this.props.theme.palette.neutralQuaternaryAlt,
                        border: "1px solid #f3f2f1",
                        borderRadius: '2px',
                        color: "#a19f9d",//this.props.theme.palette.neutralTertiary
                    }
                ],
                rootDisabled: [
                    {
                        backgroundColor: this.props.theme.palette.themePrimary,
                        border: `1px solid ${this.props.theme.palette.themePrimary}`,
                        borderRadius: '2px',
                        color: this.props.theme.palette.white,//'#ffffff',//this.props.theme.palette.white,
                        fontSize: '14px',
                        fontWeight: '600'        
                    }
                ],
                rootHovered: [
                    {
                        fontSize: '14px',
                        fontWeight: '600',
                        backgroundColor: this.props.theme.palette.themePrimary,
                        border: `1px solid ${this.props.theme.palette.themePrimary}`,
                        borderRadius: '2px',
                        color: this.props.theme.palette.white,//'#ffffff',//this.props.theme.palette.white,//'#ffffff',//this.props.theme.palette.neutralTeritary
                    }
                ],
            };

            primaryDisabledStyles = {
                
                rootCheckedDisabled: [
                    {
                        fontSize: '14px',
                        fontWeight: '600',
                        backgroundColor: "#f3f2f1",//this.props.theme.palette.neutralQuaternaryAlt,
                        //border: `3px solid #e1dfdd`,
                        borderWidth: '1px',
                        borderStyle: 'solid',
                        borderColor: "#f3f2f1",
                        borderRadius: '2px',
                        color: "#a19f9d",//this.props.theme.palette.neutralTertiary
                    }
                ],
                rootChecked: [
                    {
                        fontSize: '14px',
                        fontWeight: '600',
                        backgroundColor: "#f3f2f1",//this.props.theme.palette.neutralQuaternaryAlt,
                        border: `1px solid #f3f2f1`,
                        borderRadius: '2px',
                        color: "#a19f9d",//this.props.theme.palette.neutralTertiary
                    }
                ],
                root: [
                    {
                        fontSize: '14px',
                        fontWeight: '600',
                        backgroundColor: "#f3f2f1",//this.props.theme.palette.neutralLighter,//this.props.theme.palette.themePrimary,
                        border: `1px solid #f3f2f1`,
                        borderRadius: '2px',
                        color: "#e1dfdd",//this.props.theme.palette.neutralQuaternaryAlt,//this.props.theme.palette.white,//'#ffffff',//this.props.theme.palette.neutralTeritary
                    }
                ],
                rootDisabled: [
                    {
                        fontSize: '14px',
                        fontWeight: '600',
                        backgroundColor: "#f3f2f1",//this.props.theme.palette.neutralLighter,//this.props.theme.palette.themePrimary,
                        border: `1px solid #f3f2f1`,
                        borderRadius: '2px',
                        color: "f3f2f1",//this.props.theme.palette.neutralQuaternaryAlt,//this.props.theme.palette.white,//'#ffffff',//this.props.theme.palette.neutralTeritary
                    }
                ],
                rootHovered: [
                    {
                        fontSize: '14px',
                        fontWeight: '600',
                        backgroundColor: "#f3f2f1",//this.props.theme.palette.neutralLighter,//this.props.theme.palette.neutralLighter,
                        border: `1px solid #f3f2f1`,
                        borderRadius: '2px',
                        color: "#e1dfdd",//this.props.theme.palette.neutralQuaternaryAlt,//this.props.theme.palette.white,//'#ffffff',//this.props.theme.palette.neutralTeritary
                    }
                ],
            };

            defaultStyles = {
                root: [
                    {
                        border: 'none',
                        fontSize: '14px',
                        fontWeight: '600',
                        color: this.props.theme.semanticColors.bodyText,
                        backgroundColor: this.props.theme.semanticColors.primaryButtonText,
                        padding: '0px'
                    }
                ],
                rootHovered: [
                    {
                        border: 'none',
                        fontSize: '14px',
                        fontWeight: '600',
                        backgroundColor: this.props.theme.semanticColors.primaryButtonText,
                        color: this.props.theme.semanticColors.bodyText,
                        padding: '0px'
                    }
                ],
                rootPressed: [
                    {
                        border: '1px solid #ffffff',
                        fontSize: '14px',
                        fontWeight: '600',
                        backgroundColor: 'inherit',
                        padding: '0px'
                    }
                ],
                icon: [{
                    textDecoration: 'none',
                }],
                label: [{
                    textDecoration: "underline",
                }]
            };

            checkboxStyles = {
                root: [
                    {
                        border: 'none',
                        left: "-3px"
                    }
                ],
                checkbox: [
                    {
                        borderColor: this.props.confirmed || this.state.choosenDef.status || false ? "#f3f2f1"/*this.props.theme.palette.neutralQuaternaryAlt*/ : this.props.theme.palette.themePrimary,
                        backgroundColor: this.props.confirmed || this.state.choosenDef.status || false ? "#f3f2f1"/*this.props.theme.palette.neutralQuaternaryAlt*/ : this.props.theme.palette.themePrimary,
                        width: '20px',
                        height: '20px',
                    }
                ],
                checkmark: [
                    {
                        fontSize: "20px",
                        color: this.props.theme.semanticColors.primaryButtonText,
                        //backgroundColor: this.props.theme.palette.themePrimary,
                    }
                ],
                label: [
                    {
                        color: "#323130",//this.props.theme.palette.neutralPrimary,
                        float: 'right',
                        fontSize: "14px",
                        marginLeft: "6px",
                        fontWeight: "400",
                        textAlign: "left"
                    }
                ],
                text: [
                    {
                        maxWidth: "430px"
                    }
                ]
            };

            confirmedCheckboxStyles = {
                root: [
                    {
                        border: 'none',
                        left: "-3px"
                    }
                ],
                checkbox: [
                    {
                        borderColor: this.props.confirmed || this.state.choosenDef.status || false ? "#f3f2f1"/*this.props.theme.palette.neutralQuaternaryAlt*/ : this.props.theme.palette.themePrimary,
                        backgroundColor: this.props.confirmed || this.state.choosenDef.status || false ? "#f3f2f1"/*this.props.theme.palette.neutralQuaternaryAlt*/ : this.props.theme.palette.themePrimary,
                        width: '20px',
                        height: '20px',
                    }
                ],
                checkmark: [
                    {
                        color: "#A19F9D",
                        //backgroundColor: this.props.theme.palette.themePrimary,
                        fontSize: "20px"
                    }
                ],
                label: [
                    {
                        color: "#323130",//this.props.theme.palette.neutralPrimary,
                        float: 'right',
                        fontSize: "14px",
                        marginLeft: "6px",
                        fontWeight: "400",
                        textAlign: "left",
                    }
                ],
                text: [
                    {
                        maxWidth: "400px"
                    }
                ]
            };

            labelStyles = {
                root: [
                    {
                        color: "605e5c",//this.props.theme.palette.neutralSecondary,
                        float: 'right',
                        fontSize: "14px",
                        fontWeight: "400",
                        padding: "0px",
                        margin: "0px",
                        textAlign: "left",
                        maxWidth: "400px"
                    }
                ],
            }
        }
        else {
            primaryStyles = {
                root: [
                    {
                        fontSize: '14px',
                        fontWeight: '600',
                        backgroundColor: this.props.theme.palette.themePrimary,
                        //border: `1px solid ${this.props.theme.palette.themePrimary}`,
                        borderSize: "1px",
                        borderStyle: "solid",
                        borderColor: this.props.theme.palette.themePrimary,
                        borderRadius: '2px',
                        color: '#ffffff',//this.props.theme.palette.white//this.props.theme.palette.neutralTertiary
                    }
                ],
                rootCheckedDisabled: [
                    {
                        // fontSize: '14px',
                        // fontWeight: '600',
                        // backgroundColor: this.props.theme.palette.themePrimary,
                        // border: `1px solid ${this.props.theme.palette.themePrimary}`,
                        // borderRadius: '2px',
                        // color: '#ffffff',//this.props.theme.palette.white//this.props.theme.palette.neutralTertiary
                        fontSize: '14px',
                        fontWeight: '600',
                        backgroundColor: "#f3f2f1",//this.props.theme.palette.neutralQuaternaryAlt,
                        color: "#a19f9d",//this.props.theme.palette.neutralTertiary   
                        border: `1px solid #f3f2f1`,
                        borderRadius: '2px'
                    }
                ],
                rootChecked: [
                    {
                        fontSize: '14px',
                        fontWeight: '600',
                        backgroundColor: this.props.theme.palette.themePrimary,
                        border: `1px solid ${this.props.theme.palette.themePrimary}`,
                        borderRadius: '2px',
                        color: '#ffffff',//this.props.theme.palette.white//this.props.theme.palette.neutralTertiary
                    }
                ],
                rootDisabled: [
                    {
                        fontSize: '14px',
                        fontWeight: '600',
                        backgroundColor: this.props.theme.palette.themePrimary,
                        //border: `1px solid ${this.props.theme.palette.themePrimary}`,
                        borderWidth: '1px',
                        borderStyle: 'solid',
                        borderColor: this.props.theme.palette.themePrimary,
                        borderRadius: '2px',
                        color: '#ffffff',//this.props.theme.palette.white//this.props.theme.palette.neutralTertiary
                    }
                ],
                rootHovered: [
                    {
                        fontSize: '14px',
                        fontWeight: '600',
                        backgroundColor: this.props.theme.palette.themePrimary,
                        border: `1px solid ${this.props.theme.palette.themePrimary}`,
                        borderRadius: '2px',
                        color: '#ffffff',//this.props.theme.palette.white//this.props.theme.palette.neutralTertiary
                    }
                ],
            };

            primaryDisabledStyles = {
                rootCheckedDisabled: [
                    {
                        fontSize: '14px',
                        fontWeight: '600',
                        backgroundColor: "#f3f2f1",//this.props.theme.palette.neutralQuaternaryAlt,
                        color: "#a19f9d",//this.props.theme.palette.neutralTertiary
                        //border: "5px solid #e1dfdd",
                        borderWidth: '1px',
                        borderStyle: 'solid',
                        borderColor: "#f3f2f1",
                        borderRadius: '2px',
                    }
                ],
                root: [
                    {
                        fontSize: '14px',
                        fontWeight: '600',
                        backgroundColor: "#f3f2f1",//this.props.theme.palette.neutralQuaternaryAlt,
                        color: "#a19f9d",//this.props.theme.palette.neutralTertiary
                        border: `1px solid #f3f2f1`,
                        borderRadius: '2px',
                    }
                ],
                rootDisabled: [
                    {
                        fontSize: '14px',
                        fontWeight: '600',
                        backgroundColor: "#f3f2f1",//this.props.theme.palette.neutralQuaternaryAlt,
                        color: "#a19f9d",//this.props.theme.palette.neutralTertiary
                        border: `1px solid #f3f2f1`,
                        borderRadius: '2px',
                    }
                ],
                rootHovered: [
                    {
                        fontSize: '14px',
                        fontWeight: '600',
                        backgroundColor: "#f3f2f1",//this.props.theme.palette.neutralQuaternaryAlt,
                        color: "#a19f9d",//this.props.theme.palette.neutralTertiary
                        border: `1px solid #f3f2f1`,
                        borderRadius: '2px',
                    }
                ],
            };

            defaultStyles = {
                root: [
                    {
                        border: 'none',
                        fontSize: '14px',
                        fontWeight: '600',
                        backgroundColor: 'inherit',
                        padding: '0px'
                    }
                ],
                rootHovered: [
                    {
                        border: 'none',
                        fontSize: '14px',
                        fontWeight: '600',
                        backgroundColor: 'inherit',
                        padding: '0px'
                    }
                ],
                rootPressed: [
                    {
                        border: '1px solid #000000',
                        fontSize: '14px',
                        fontWeight: '600',
                        backgroundColor: 'inherit',
                        padding: '0px'
                    }
                ],
                icon: [{
                    textDecoration: 'none',
                    color: this.props.theme.palette.black
                }],
                label: [{
                    textDecoration: "underline",
                    color: this.props.theme.palette.black
                }]
            };

            checkboxStyles = {
                root: [
                    {
                        border: 'none',
                        left: "-3px"
                    }
                ],
                checkbox: [
                    {
                        borderColor: this.props.confirmed || this.state.choosenDef.status || false ? "#f3f2f1"/*this.props.theme.palette.neutralQuaternaryAlt*/ : this.props.theme.palette.themePrimary,
                        backgroundColor: this.props.confirmed || this.state.choosenDef.status || false ? "#f3f2f1"/*this.props.theme.palette.neutralQuaternaryAlt*/ : this.props.theme.palette.themePrimary,
                        width: '20px',
                        height: '20px',
                    }
                ],
                checkmark: [
                    {
                        color: this.props.theme.semanticColors.primaryButtonText,
                        //backgroundColor: this.props.theme.palette.themePrimary,
                        fontSize: "20px"
                    }
                ],
                label: [
                    {
                        color: "#323130",//this.props.theme.palette.neutralPrimary,
                        float: 'right',
                        fontSize: "14px",
                        marginLeft: "6px",
                        fontWeight: "400",
                        textAlign: "left",
                    }
                ],
                text: [
                    {
                        maxWidth: "400px"
                    }
                ]
            };

            confirmedCheckboxStyles = {
                root: [
                    {
                        border: 'none',
                        left: "-3px"
                    }
                ],
                checkbox: [
                    {
                        borderColor: this.props.confirmed || this.state.choosenDef.status || false ? "#f3f2f1"/*this.props.theme.palette.neutralQuaternaryAlt*/ : this.props.theme.palette.themePrimary,
                        backgroundColor: this.props.confirmed || this.state.choosenDef.status || false ? "#f3f2f1"/*this.props.theme.palette.neutralQuaternaryAlt*/ : this.props.theme.palette.themePrimary,
                        width: '20px',
                        height: '20px',
                    }
                ],
                checkmark: [
                    {
                        color: "#A19F9D",
                        //backgroundColor: this.props.theme.palette.themePrimary,
                        fontSize: "20px"
                    }
                ],
                label: [
                    {
                        color: "#323130",//this.props.theme.palette.neutralPrimary,
                        float: 'right',
                        fontSize: "14px",
                        marginLeft: "6px",
                        fontWeight: "400",
                        textAlign: "left",
                    }
                ],
                text: [
                    {
                        maxWidth: "400px"
                    }
                ]
            };

            labelStyles = {
                root: [
                    {
                        color: "605e5c",//this.props.theme.palette.neutralSecondary,
                        float: 'right',
                        padding: "0px",
                        margin: "0px",
                        fontSize: "14px",
                        fontWeight: "400",
                        textAlign: "left",
                        maxWidth: "400px"
                    }
                ],
            }
        }

        const icon: IIconProps = { iconName: 'OpenInNewWindow' };

        const element: any = document.getElementById("textArea1");

        if (element && element.value === '') {
            element.style.display = 'none';
        }

        if (this.props.editMode === 2 && element) {
            element.style.display = 'block';
        }
        
        if (this.props.editMode === 1 && element && element.value !== '') {
            element.style.display = 'block';
        }

        return (
            <>
                <div className={this.props.title.trim() ? styles.cfmWrapper : styles.cfmWrapperDisplayNone}>
                    <textarea id="textArea" className={(this.props.darkTheme) ? styles.textAreaDark : styles.textArea} /*placeholder={(this.props.editMode === 2) ? "Potwierdzanie informacji" : ""}*/ rows={1} aria-label="Add a title" readOnly={true} value={this.props.title}></textarea>
                </div>
                <div className={styles.responsive}>
                    <div className={styles.cfmWrapper}>
                        <div className={styles.confirm}>
                            <Checkbox styles={this.props.confirmed || this.state.choosenDef.status ? confirmedCheckboxStyles : checkboxStyles} /*label={this.props.confirmText || "Dodaj informacje, które należy potwierdzić do listy."}*/ defaultChecked={this.state.choosenDef.checkboxState || false} disabled={this.props.confirmed || this.state.choosenDef.status || false} checked={this.state.choosenDef.checkboxState} onChange={this.handleChange} />
                            <Label styles={labelStyles}> {this.props.confirmText || "Dodaj informacje, które należy potwierdzić do listy."}</Label>
                        </div>
                    </div>
                    <div className={styles.btnWrapper}>
                        {
                            this.props.confirmed || this.state.choosenDef.status
                                ?
                                <>
                                    <PrimaryButton text={this.props.afterConfirmBtnText} styles={primaryDisabledStyles} disabled={true} checked={true} />
                                    {
                                        this.props.moreButtonVisible ? <DefaultButton text={this.props.addBtnText} iconProps={icon} styles={defaultStyles} onClick={() => window.open(this.props.addBtnLink, '_blank')} /> : <div></div>
                                    }
                                </>
                                :
                                <>
                                    <PrimaryButton text={this.props.confirmBtnText} disabled={!this.state.choosenDef.checkboxState} styles={primaryStyles} onClick={() => { this.postItems(this.props, this.props.confirmText, this.props.context); this.setState({ checkStatus: true }); this.render() }} />
                                    {
                                        this.props.moreButtonVisible ? <DefaultButton text={this.props.addBtnText} iconProps={icon} styles={defaultStyles} onClick={() => window.open(this.props.addBtnLink, '_blank')} /> : <div></div>
                                    }
                                </>
                        }
                    </div>
                </div>
            </>
        );
    }
}
