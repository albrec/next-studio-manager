export type LabelType = {
  id: string,
  name: string,
  count: number,
  fontSize: string,
  lineHeight: string,
  sheet: SheetDef,
  label: LabelDef
}

export type SheetDef = {
  width: string,
  height: string,
  padding: string,
}

export type LabelDef = {
  width: string,
  height: string,
  padding: string,
}



export const Avery5160: LabelType = {
  id: 'Avery5160',
  name: 'Avery 5160',
  count: 30,
  fontSize: '11pt',
  lineHeight: '1.3',
  sheet: {
    width: '8.5in',
    height: '11in',
    padding: '0.42in 0.22in',
  },
  label: {
    width: '2.625in',
    height: '1in',
    padding: '0.1in .15in',
  }
}

export const Avery5195: LabelType = {
  id: 'Avery5195',
  name: 'Avery 5195',
  count: 60,
  fontSize: '8pt',
  lineHeight: '1.15',
  sheet: {
    width: '8.5in',
    height: '11in',
    padding: '0.525in 0.3in 0.59in 0.3in',
  },
  label: {
    width: '1.75in',
    height: '0.66in',
    padding: '0.06in .1in',
  }
}

export const LabelTypes = {
  [Avery5160.id]: Avery5160,
  [Avery5195.id]: Avery5195,
}