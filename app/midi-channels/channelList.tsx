import { Box, Divider, IconButton, List, ListItem, Paper, Typography } from "@mui/material"
import { MidiChannelNumbers } from "../state/descriptions"
import { useDevices } from "../state/deviceContext"
import classNames from "classnames"
import { Edit } from "@mui/icons-material"


export default function ChannelList() {
  const devices = useDevices()
  const assignedChannels = devices?.reduce<number[]>((acc, d) => acc.concat(d.midiChannels || []), [])
  
  return (
    <List dense>
      { MidiChannelNumbers.map(c =>
        <Channel channel={ c } isAssigned={ !!assignedChannels?.includes(c) } key={ c } />
      )}
    </List>
  )
}

function Channel({ channel, isAssigned }: { channel: number, isAssigned: boolean }) {
  const devices = useDevices()
  

  return (
    <ListItem>
      <Paper className={ classNames("w-full p-4 mb-2", isAssigned ? 'bg-teal-100' : 'bg-gray-300') } elevation={ 3 }>
        <Box className="flex items-center justify-between">
          <Typography variant="h4">Channel: { channel } { !isAssigned && <em className="opacity-50">Not assigned</em> }</Typography>
          <IconButton><Edit /></IconButton>
        </Box>
        { isAssigned &&
        <Box className="text-sm">
          <Divider className="mt-4">Devices</Divider>
          { devices?.filter(d => d.midiChannels?.includes(channel)).map(d => 
            <Typography key={ d.id }>{ d.name }</Typography>
          ) }
        </Box>
        }
      </Paper>
    </ListItem>
  )
}