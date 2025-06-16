import { SPHttpClient } from "@microsoft/sp-http";

export interface IPotwierdzanieInformacjiProps {
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
  
  editMode: number,
  context: any,
  darkTheme: boolean,
  theme: any,
  textAreaValue: string;
}
