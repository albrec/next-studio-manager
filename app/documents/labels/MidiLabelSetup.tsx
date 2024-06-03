import { Device } from "@/lib/features/devices/deviceTypes"
import { getDecoratedDevices } from "@/lib/features/devices/devicesSlice"
import { PortTypes } from "@/lib/features/ports/portTypes"
import { useAppSelector } from "@/lib/hooks"
import { Box, Button, ButtonGroup, Card, CardContent, FormControl, FormLabel, InputLabel, MenuItem, Select, TextField, Typography } from "@mui/material"
import { DefaultLabelType } from "../LabelSheet"
import { useState } from "react"
import { MidiLabels } from "./MidiLabels"
import { LabelTypes } from "../labelTypes"
import classNames from "classnames"

export default function MidiLabelSetup() {
  const devices = useAppSelector(getDecoratedDevices(PortTypes.MIDI))
  const [labelType, setLabelType] = useState<string>(DefaultLabelType.id)
  const [firstIdx, setFirstIdx] = useState(0)
  const [skipLabels, setSkipLabels] = useState<string[]>([])
  const [selectSkip, setSelectSkip] = useState(false)

  return (
    <>
      <Card className="mb-4">
        <CardContent>
          <Typography variant="h3" gutterBottom>MIDI Setup</Typography>

          <Box className="flex gap-8">
            <FormControl>
              <InputLabel>Label Type</InputLabel>
              <Select
                label="Label Type"
                value={ labelType }
                onChange={ (e) => setLabelType(e.target.value) }
              >
                { Object.values(LabelTypes).map(label =>
                  <MenuItem value={ label.id } key={ label.id }>{ label.name }</MenuItem>
                )}
              </Select>
            </FormControl>

            <FormControl>
              <TextField type="number" label="Skip to" sx={{ minWidth: '12ch' }} inputProps={{ min: 0, max: LabelTypes[labelType].count - 1 }} onChange={ (e) => setFirstIdx(parseInt(e.target.value)) } />
            </FormControl>
            
            <FormControl className="flex flex-row items-center gap-4">
              <FormLabel>Skip Labels</FormLabel>
              <ButtonGroup>
                <Button onClick={ () => setSelectSkip(!selectSkip) } variant={ selectSkip ? 'contained' : 'outlined'}>Select</Button>
                <Button onClick={ () => setSkipLabels([]) }>Reset</Button>
              </ButtonGroup>
            </FormControl>
          </Box>
        </CardContent>
      </Card>

      <MidiLabels className={ classNames({ selectSkip: selectSkip }) } type={ labelType } firstIdx={ firstIdx } labelClick={ addSkipLabel } skipLabels={ skipLabels } />
    </>
  )

  function addSkipLabel(device: Device) {
    if(selectSkip) {
      setSkipLabels(skipLabels.concat(device.id))
    }
  }
}