import { Box, Card, CardContent, Paper } from "@mui/material"
import "./LabelSheet.css"
import { ReactNode } from "react"

export enum LabelTypes {
  Avery5160 = 'AVERY-5160'
}

export default function LabelSheet({ labels, type = LabelTypes.Avery5160, noLabelMargin = false }: { labels: ReactNode[], type?: LabelTypes, noLabelMargin?: boolean }) {
  const labelOverrides = {
    padding: noLabelMargin ? 0 : '.1in .16in .16in'
  }

  return (
    <Box className="label-sheet" data-label-type={ type }>
      { labels.map((label, i) => 
        <Card className="label" key={ i }>
          <CardContent sx={ labelOverrides }>
            { label }
          </CardContent>
        </Card>
      )}
    </Box>
  )
}
