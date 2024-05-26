import { Box, Card, CardContent, Paper } from "@mui/material"
import "./LabelSheet.css"
import { ReactNode } from "react"

export enum LabelTypes {
  Avery5160 = 'Avery-5160'
}
export const DefaultLabelType = LabelTypes.Avery5160

export default function LabelSheet({ labels, type = DefaultLabelType, noLabelMargin = false }: { labels: React.ReactElement[], type?: LabelTypes, noLabelMargin?: boolean }) {

  return (
    <Box className="label-sheet" data-label-type={ type }>
      { labels.map((label, i) => 
        <Label labelContent={ label } noLabelMargin={ noLabelMargin } key={ i } />
      )}
    </Box>
  )
}

function Label({ labelContent, noLabelMargin }: { labelContent: React.ReactElement, noLabelMargin: boolean }) {
  const labelColor: string = labelContent.props.labelColor || 'white'
  const textColor: string = `hsl(from ${labelColor} h 0 calc((l - 60) * -100))`
  const labelOverrides = {
    padding: noLabelMargin ? 0 : '.1in .16in .16in',
  }

  return (
    <Card sx={{ bgcolor: labelColor, color: textColor }} className="label">
      <CardContent sx={ labelOverrides }>
        { labelContent }
      </CardContent>
    </Card>
  )
}
