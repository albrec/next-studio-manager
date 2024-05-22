import { Box, Divider, IconButton, List, ListItem, Paper, Typography } from "@mui/material"
import classNames from "classnames"
import { Edit } from "@mui/icons-material"
import { getDevices } from "@/lib/features/devices/devicesSlice"
import { useSelector } from "react-redux"
import { MidiChannelNumbers, MidiChannelPayload } from "@/lib/features/midiChannels/midiChannelsTypes"
import { useState } from "react"
import ChannelForm from "./channelForm"
import { channel } from "diagnostics_channel"
import { useAppSelector } from "@/lib/hooks"
import { getMidiChannel } from "@/lib/features/midiChannels/midiChannelsSlice"


export default function ChannelList() {
  const devices = useSelector(getDevices)
  const [channelModalOpen, setChannelModalOpen] = useState<boolean | 'closing'>(false)
  const [editMidiChannel, setEditMidiChannel] = useState<number | null>(null)
  const assignedChannels = devices?.reduce<number[]>((acc, d) => acc.concat(d.midiChannels || []), [])
  
  return (
    <>
      <List dense>
        { MidiChannelNumbers.map(c =>
          <Channel channelNumber={ c } isAssigned={ !!assignedChannels?.includes(c) } key={ c } />
        )}
      </List>
      { editMidiChannel && 
        <ChannelForm
          channelNumber={ editMidiChannel }
          open={ channelModalOpen === true }
          onClose={ () => setChannelModalOpen('closing') }
          onExited={ () => setEditMidiChannel(null) }
        /> }
    </>
  )

  function Channel({ channelNumber, isAssigned }: { channelNumber: number, isAssigned: boolean }) {
    const channel = useAppSelector(getMidiChannel(channelNumber))

    return (
      <ListItem>
        <Paper
          className={ classNames("w-full p-4 mb-2") }
          elevation={ 3 }
          sx={{
            bgcolor: isAssigned ? 'primary.light' : 'grey.600',
            color: 'primary.contrastText',
          }}
        >
          <Box className="flex items-center justify-between">
            <Box className="flex gap-12">
              <Typography variant="h4">
                Channel: <strong>{ channelNumber }</strong>
                { !isAssigned && <em className="opacity-50"> Not assigned</em> }
              </Typography>
              { channel &&
                <Typography variant="h4">Label: <strong>{ channel.name }</strong></Typography>
              }
              { isAssigned &&
              <Box className="text-sm">
                <Typography variant="h4">
                  Devices:  <strong>{ devices?.filter(d => d.midiChannels?.includes(channelNumber)).map(d => d.name).join(', ') }</strong>
                </Typography>
                
              </Box>
              }
            </Box>
            <IconButton onClick={ () => editChannel(channelNumber) }><Edit /></IconButton>
          </Box>
          
        </Paper>
      </ListItem>
    )
  }

  function editChannel(channel: number) {
    setEditMidiChannel(channel)
    setChannelModalOpen(true)
  }
}

