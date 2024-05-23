import { Box, Card, CardActionArea, CardContent, CardHeader, Typography } from "@mui/material"
import Grid from "@mui/material/Unstable_Grid2/Grid2"
import Head from "next/head"
import Link from "next/link"

export default function Labels() {
  return (
    <>
      <Head>
        <title>Documents</title>  
      </Head>

      <Typography variant="h1">Documents</Typography>

      <Box className="flex gap-4">
        <Card sx={{ bgcolor: 'grey.200' }} className="basis-1/3">
          <CardActionArea LinkComponent={Link} href="/documents/midi-chart">
            
            <CardContent>
              <Typography variant="h3" gutterBottom>MIDI Chart</Typography>

              Chart that provides breakdown of MIDI Channel assignments as MIDI Port connections. 
            </CardContent>
          </CardActionArea>
        </Card>
      </Box>
    </>
  )
}
