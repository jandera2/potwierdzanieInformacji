import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  IPropertyPaneDropdownOption,
  PropertyPaneDropdown,
  PropertyPaneTextField,
  PropertyPaneToggle
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import { IReadonlyTheme } from '@microsoft/sp-component-base';

import * as strings from 'PotwierdzanieInformacjiWebPartStrings';
import PotwierdzanieInformacji from './components/PotwierdzanieInformacji';
import { IPotwierdzanieInformacjiProps } from './components/IPotwierdzanieInformacjiProps';
import { getElementFromList, getElementsFromList } from './functions/functions';

export interface IPotwierdzanieInformacjiWebPartProps {
  title: string,
  listUrl: string,
  listName: string,
  choosenDef: number,

  confirmListUrl: string,
  confirmListName: string,

  confirmBtnText: string,
  afterConfirmBtnText: string,

  addBtnText: string,
  addBtnLink: string,
  moreButtonVisible: boolean,
  textAreaValue: string
}

export interface IReactGetItemsState {
  items: IPropertyPaneDropdownOption[];
}

export default class PotwierdzanieInformacjiWebPart extends BaseClientSideWebPart<IPotwierdzanieInformacjiWebPartProps> {

  private _isDarkTheme: boolean = false;
  private _environmentMessage: string = '';
  private _theme: any;

  protected dropdownOptions: IPropertyPaneDropdownOption[] = [];

  protected state = {
    loading: true,
    people: [],
    definitions: [],
    dropdownOptions: []
  }

  public async render(): Promise<void> {

    if (this.properties.listUrl && this.properties.listName) {

      const data = await getElementsFromList(this.properties.listUrl, this.properties.listName);

      (this.dropdownOptions as []).length = 0;
      this.dropdownOptions.push(...data.map(field => ({ key: field.ID, text: field.Title })));
    }

    if (this.properties.choosenDef) {
      const def = await getElementFromList(this.properties.confirmListUrl, this.properties.confirmListName, this.properties.choosenDef, this.context.pageContext.user.email);
    }

    const element: React.ReactElement<IPotwierdzanieInformacjiProps> = React.createElement(
      PotwierdzanieInformacji,
      {
        title: this.properties.title,
        listUrl: this.properties.listUrl,
        listName: this.properties.listName,
        choosenDef: this.properties.choosenDef,

        confirmListUrl: this.properties.confirmListUrl,
        confirmListName: this.properties.confirmListName,

        confirmBtnText: this.properties.confirmBtnText,
        afterConfirmBtnText: this.properties.afterConfirmBtnText,

        addBtnText: this.properties.addBtnText,
        addBtnLink: this.properties.addBtnLink,
        moreButtonVisible: this.properties.moreButtonVisible,

        editMode: this.displayMode,
        context: this.context,
        darkTheme: this._isDarkTheme,
        theme: this._theme,
        textAreaValue: this.properties.textAreaValue
      }
    );

    ReactDom.render(element, this.domElement);
  }

  protected async onInit(): Promise<void> {
    this._environmentMessage = this._getEnvironmentMessage();

    if (this.properties.listUrl && this.properties.listName) {
      const data = await getElementsFromList(this.properties.listUrl, this.properties.listName);

      (this.dropdownOptions as []).length = 0;
      this.dropdownOptions.push(...data.map(field => ({ key: field.ID, text: field.Title })));
    }

    return super.onInit();
  }

  private _getEnvironmentMessage(): string {
    if (!!this.context.sdks.microsoftTeams) { 
      return this.context.isServedFromLocalhost ? strings.AppLocalEnvironmentTeams : strings.AppTeamsTabEnvironment;
    }

    return this.context.isServedFromLocalhost ? strings.AppLocalEnvironmentSharePoint : strings.AppSharePointEnvironment;
  }

  protected onThemeChanged(currentTheme: IReadonlyTheme | undefined): void {
    if (!currentTheme) {
      return;
    }

    this._isDarkTheme = !!currentTheme.isInverted;
    this._theme = currentTheme;
    const {
      semanticColors
    } = currentTheme;

    if (semanticColors) {
      this.domElement.style.setProperty('--bodyText', semanticColors.bodyText || null);
      this.domElement.style.setProperty('--link', semanticColors.link || null);
      this.domElement.style.setProperty('--linkHovered', semanticColors.linkHovered || null);
      this.domElement.style.setProperty('--themePrimary', currentTheme.palette.themePrimary || null);
      this.domElement.style.setProperty('--themeDark', currentTheme.palette.themeDark || null);
      this.domElement.style.setProperty('--neutralPrimary', "#323130" || null);
      this.domElement.style.setProperty('--neutralSecondary', "#605e5c" || null);
      this.domElement.style.setProperty('--neutralTeritary', "#a19f9d" || null);
      this.domElement.style.setProperty('--white', "#ffffff" || null);
      this.domElement.style.setProperty('--neutralLight', "#edebe9" || null);
      this.domElement.style.setProperty('--neutralLighter', "#f3f2f1" || null);
      this.domElement.style.setProperty('--neutralLighterAlt', "#faf9f8" || null);
      this.domElement.style.setProperty('--neutralQuaternaryAlt', "#e1dfdd" || null);
    }

  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {

    if (!this.dropdownOptions && this.state.dropdownOptions) this.dropdownOptions = this.state.dropdownOptions;
    return {
      pages: [
        {
          displayGroupsAsAccordion: true,
          header: {
            description: "Wyświetl informacje, które miałby zaakceptować użytkownik, wybierając co ma zaakceptować."//strings.DescriptionFieldLabel
          },
          groups: [
            {
              isCollapsed: false,
              groupName: "Źródło informacji",
              groupFields: [
                PropertyPaneTextField('title', {
                  label: "Wprowadź tytuł webPartu", //strings.LinkFieldLabel                 
                }),
              ]
            },
            {
              isCollapsed: true,
              groupName: "Źródło informacji",
              groupFields: [
                PropertyPaneTextField('listUrl', {
                  label: "Wprowadź link do witryny z definicjami zgód", //strings.LinkFieldLabel
                  placeholder: "https://supremospzoo.sharepoint.com"
                }),
                PropertyPaneTextField('listName', {
                  label: "Nazwa listy z definicjami zgód",//strings.FontFamily
                  placeholder: "Definicje"
                }),
                PropertyPaneDropdown('choosenDef', {
                  label: "Wybrana definicja zgody",
                  options: this.dropdownOptions
                }),
              ]
            },
            {
              isCollapsed: true,
              groupName: "Źródło listy z potwierdzeniami",
              groupFields: [
                PropertyPaneTextField('confirmListUrl', {
                  label: "Wprowadź link do witryny z listą wyrażonych zgód", //strings.LinkFieldLabel
                  placeholder: "https://supremospzoo.sharepoint.com"
                }),
                PropertyPaneTextField('confirmListName', {
                  label: "Nazwa listy z wyrażonymi zgodami",//strings.FontFamily
                  placeholder: "Zgody"
                }),
              ]
            },
            {
              isCollapsed: true,
              groupName: "Właściwości przycisków",
              groupFields: [
                PropertyPaneTextField('confirmBtnText', {
                  label: "Etykieta przycisku potwierdzającego", //strings.LinkFieldLabel
                  placeholder: "Potwierdzam",
                }),
                PropertyPaneTextField('afterConfirmBtnText', {
                  label: "Etykieta przycisku potwierdzonego",//strings.FontFamily
                  placeholder: "Potwierdzono"
                }),
                PropertyPaneToggle('moreButtonVisible', {
                  label: "Wybierz, czy przycisk dodatkowy ma być widoczny",
                  onText: "Widoczny",
                  offText: "Niewidoczny"
                }),
                PropertyPaneTextField('addBtnText', {
                  label: "Etykieta przycisku dodatkowego", //strings.LinkFieldLabel
                })
                /*
                PropertyPaneTextField('addBtnLink', {
                  label: "Link",//strings.FontFamily
                  placeholder: "https://"
                })
                */
              ]
            }
          ]
        }
      ]
    };
  }
}
