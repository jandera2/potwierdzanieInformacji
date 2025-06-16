import * as React from 'react';
import styles from './PotwierdzanieInformacji.module.scss';
import { IPotwierdzanieInformacjiProps } from './IPotwierdzanieInformacjiProps';
import { makeStyles, Checkbox, Button } from "@fluentui/react-components";
import { CalendarMonthRegular, CalendarMonthFilled } from '@fluentui/react-icons';
import { } from '@fluentui/react'
import Buttons from './Buttons';
import { datesInSameYear, getDef, getElementFromList, getElementsFromList } from '../functions/functions';
import Confirmation from './Confirmation';
import { IPropertyPaneDropdownOption } from '@microsoft/sp-property-pane';
import { SPHttpClient } from '@microsoft/sp-http';


export default class PotwierdzanieInformacji extends React.Component<IPotwierdzanieInformacjiProps, {}> {

  state = {
    loading: true,
    people: [],
    definitions: [],
    dropdownOptions: [],
    choosenDef: {
      id: 1,
      status: true,
      text: "",
      btnLink: ""
    }
  }

  async componentDidUpdate(prevProps, prevState) {

            console.log("update");


    if (this.props !== prevProps/* || this.state !== prevState*/) {
      
      const data = await getElementsFromList(this.props.listUrl, this.props.listName, "ID,Title,ConsentText,ConsentMail,ConsentLink");

      let arr = [];
      (this.state.dropdownOptions as []).length = 0;

      if (data) {
        arr.push(...data.map(field => ({ key: field.ID, text: field.Title })));

        this.setState({ dropdownOptions: arr });

        const defStatus = await getElementFromList(this.props.confirmListUrl, this.props.confirmListName, this.props.choosenDef, this.props.context.pageContext.user.email);

        let defText;
        let btnLink;
        
        getDef(this.props.listUrl, this.props.listName, this.props.choosenDef).then((result) => {
          defText = result[0].ConsentText;
          console.log(result[0].ConsentText);
          btnLink = result[0].ConsentLink;
          console.log(result[0].ConsentLink);
          this.setState({ choosenDef: { Id: this.props.choosenDef, status: defStatus, text: result[0].ConsentText, btnLink: result[0].ConsentLink } });

        });
        //this.setState({ choosenDef: { Id: this.props.choosenDef, status: defStatus, text: defText, btnLink: btnLink } });

        this.render();

      }


      this.render();

    }

  }

  async componentDidMount() {

    console.log("mount");

    const data = await getElementsFromList(this.props.listUrl, this.props.listName, "ID,Title,ConsentText,ConsentMail");

    let arr = [];
    (this.state.dropdownOptions as []).length = 0;

    if (data) {
      arr.push(...data.map(field => ({ key: field.ID, text: field.Title })));

      this.setState({ dropdownOptions: arr });

      const defStatus = await getElementFromList(this.props.confirmListUrl, this.props.confirmListName, this.props.choosenDef, this.props.context.pageContext.user.email);

      let defText;
      let btnLink;
      
      getDef(this.props.listUrl, this.props.listName, this.props.choosenDef).then((result) => {
        defText = result[0].ConsentText;
        console.log(result[0].ConsentText);
        btnLink = result[0].ConsentLink;
        console.log(result[0].ConsentLink);
        this.setState({ choosenDef: { Id: this.props.choosenDef, status: defStatus, text: result[0].ConsentText, btnLink: result[0].ConsentLink } });

    });
      //this.setState({ choosenDef: { Id: this.props.choosenDef, status: defStatus, text: defText, btnLink: btnLink } });
    }

    this.render();
  }

  public render(): React.ReactElement<IPotwierdzanieInformacjiProps> {

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
      darkTheme,
      theme,
      textAreaValue
    } = this.props;

    if (this.state.choosenDef.status === undefined) {
      this.setState({ choosenDef: { Id: this.state.choosenDef.id, status: true, text: this.state.choosenDef.text } });
    }

    return (
      <>
        {
          (!this.props.listUrl || this.props.listUrl === '' || !this.props.listName || this.props.listName === '' || !this.props.choosenDef) ?
            <Buttons
              title={this.props.title}
              theme={this.props.theme}
              listUrl={this.props.listUrl}
              listName={this.props.listName}
              choosenDef={this.props.choosenDef}
              context={this.props.context}
              confirmListUrl={this.props.confirmListUrl}
              confirmListName={this.props.confirmListName}
              editMode={this.props.editMode}
              confirmBtnText={"Potwierdzam"}
              afterConfirmBtnText={"Potwierdzam"}
              addBtnText={this.props.addBtnText}
              addBtnLink={this.state.choosenDef.btnLink}
              moreButtonVisible={this.props.moreButtonVisible || false}
              confirmed={this.state.choosenDef.status || false}
              confirmText={this.state.choosenDef.text}
              darkTheme={this.props.darkTheme}
              textAreaValue={this.props.textAreaValue}
            />
            :
            <Buttons
              title={this.props.title}
              theme={this.props.theme}
              listUrl={this.props.listUrl}
              listName={this.props.listName}
              choosenDef={this.props.choosenDef}
              context={this.props.context}
              confirmListUrl={this.props.confirmListUrl}
              confirmListName={this.props.confirmListName}
              editMode={this.props.editMode}
              confirmBtnText={this.props.confirmBtnText || "Potwierdzam"}
              afterConfirmBtnText={this.props.afterConfirmBtnText}
              addBtnText={this.props.addBtnText}
              addBtnLink={this.state.choosenDef.btnLink}
              moreButtonVisible={this.props.moreButtonVisible || false}
              confirmed={this.state.choosenDef.status || false}
              confirmText={this.state.choosenDef.text}
              darkTheme={this.props.darkTheme}
              textAreaValue={this.props.textAreaValue}
            />
        }
      </>
    );
  }
}
