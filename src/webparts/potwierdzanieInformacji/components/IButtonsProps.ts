export interface IButtonsProps {
  title: string,
  listUrl: string,
  listName: string,
  choosenDef: number,

  confirmListUrl: string,
  confirmListName: string,

  editMode: number,
  confirmed: boolean,
  confirmBtnText: string,
  afterConfirmBtnText: string,

  addBtnText: string,
  addBtnLink: string,
  moreButtonVisible: boolean,

  context: any,
  confirmText: string,
  darkTheme: boolean,
  theme: any;
  textAreaValue: string;
}
