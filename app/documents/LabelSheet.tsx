import { Box, Card, CardContent, Paper } from "@mui/material"
import { Avery5195, LabelDef, LabelType, SheetDef } from "./labelTypes"
import classNames from "classnames"

export const DefaultLabelType = Avery5195

export default function LabelSheet({ labels, type = DefaultLabelType, firstIdx = 0, noLabelMargin = false, className }: { labels: React.ReactElement[], type?: LabelType, firstIdx: number, noLabelMargin?: boolean, className?: string }) {
  const pagesNeeded = Math.ceil((labels.length + firstIdx) / type.count)
  const countedLabels = Array.from({ length: type.count * pagesNeeded }, (x, i) => {
    return labels[i - firstIdx] || <span key={i} />
  })

  const pagedLabels = chunkIntoN(countedLabels, pagesNeeded)

  return (
    <>
      { pagedLabels.map((labelPage, i) =>
        <Paper sx={ type.sheet } className={ classNames("label-sheet mb-4", className) } data-label-type={ type.id } elevation={5} square key={i}>
          <PageStyle type={ type } />
          { labelPage.map((label, i) => 
            <Label labelContent={ label } noLabelMargin={ noLabelMargin } labelDef={ type.label } key={ i } />
          )}
        </Paper>
      )}
    </>
  )
}


function Label({ labelContent, noLabelMargin, labelDef }: { labelContent: React.ReactElement, noLabelMargin: boolean, labelDef: LabelDef }) {
  const labelColor = labelContent.props.labelColor || 'white'
  const labelClick = labelContent.props.labelClick
  const labelStyle = {
    ...labelDef,
    bgcolor: labelColor,
    color: `hsl(from ${labelColor} h 0 calc((l - 60) * -100))`,
    padding: noLabelMargin ? 0 : labelDef.padding,
  }

  return (
    <Card sx={ labelStyle } className="label" onClick={ labelClick }>
      <CardContent sx={{ padding: 0 }}>
        { labelContent }
      </CardContent>
    </Card>
  )
}


function PageStyle({ type }: { type: LabelType }) {
  return (
    <style>
      {`
      @media print {
        @page labelSheet {
          size: ${type.sheet.width} ${type.sheet.height};
          margin: ${type.sheet.padding};
        }

        .label-sheet {
          page: labelSheet;
          background-color: white;
          border: none !important;
          box-shadow: none;

          .label {
            border: none !important;
          }
        }
      }

      .label-sheet {
        display: flex;
        justify-content: space-between;
        flex-wrap: wrap;
        align-content: flex-start;
        box-sizing: border-box;
        page-break-inside: avoid;
        font-size: ${type.fontSize};
        line-height: ${type.lineHeight};
      
        .label {
          position: relative;
          box-sizing: border-box;
          overflow: hidden;
          box-shadow: none;
          border: 1px solid black;
        }
      }
      `}
    </style>
  )
}



const chunkIntoN = (arr: any[], n: number) => {
  const size = Math.ceil(arr.length / n)
  return Array.from({ length: n }, (v, i) =>
    arr.slice(i * size, i * size + size)
  )
}