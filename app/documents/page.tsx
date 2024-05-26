import { Crop169, Piano } from "@mui/icons-material"
import { Box, Card, CardActionArea, CardContent, Typography } from "@mui/material"
import Head from "next/head"
import Link from "next/link"

export default function Labels() {
  return (
    <>
      <Head>
        <title>Documents</title>  
      </Head>

      <Typography variant="h1" gutterBottom>Documents</Typography>

      <Box className="flex gap-4">

        <Card sx={{ bgcolor: 'grey.200' }} className="basis-1/3">
          <CardActionArea LinkComponent={Link} href="/documents/midi-chart">
            
            <CardContent>
              <Typography className="flex items-center gap-2" variant="h3" gutterBottom><Piano /> MIDI Chart</Typography>

              Chart that provides breakdown of MIDI Channel assignments as MIDI Port connections. 
            </CardContent>
          </CardActionArea>
        </Card>

        <Card sx={{ bgcolor: 'grey.200' }} className="basis-1/3">
          <CardActionArea LinkComponent={Link} href="/documents/labels">
            
            <CardContent>
              <Typography className="flex items-center gap-2" variant="h3" gutterBottom><Crop169 /> Labels</Typography>

              Device labels that include useful information for everyday use. MIDI channels, connections, etc.
            </CardContent>
          </CardActionArea>
        </Card>

      </Box>
    </>
  )
}
