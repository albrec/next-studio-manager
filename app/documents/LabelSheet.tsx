import { Box, Card, CardContent, Paper } from "@mui/material"
import "./LabelSheet.css"
import { ReactNode } from "react"

export enum LabelTypes {
  Avery5160 = 'Avery-5160',
  Avery5195 = 'Avery-5195',
}
export const DefaultLabelType = LabelTypes.Avery5195

export default function LabelSheet({ labels, type = DefaultLabelType, noLabelMargin = false }: { labels: React.ReactElement[], type?: string, noLabelMargin?: boolean }) {

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
  const padding = noLabelMargin ? 0 : '.1in .16in .16in'

  return (
    <Card sx={{ bgcolor: labelColor, color: textColor, padding }} className="label">
      <CardContent sx={{ padding: 0 }}>
        { labelContent }
      </CardContent>
    </Card>
  )
}
