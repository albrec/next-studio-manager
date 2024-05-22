import { useAppDispatch, useAppSelector } from "@/lib/hooks"
import classNames from "classnames"
import { memo } from "react"
import { useSetHover } from "./connectionGrid"
import { toggle } from "@/lib/features/connections/connectionsSlice"
import { getPort } from "@/lib/features/ports/portsSlice"
import { SubdirectoryArrowRight } from "@mui/icons-material"

export default memo(function ConnectionNode({ 
  inputId,
  // inputType,
  outputId,
  // outputType,
}: { 
    inputId: string,
    // inputType: PortTypes,
    outputId: string,
    // outputType: PortTypes,
}) {
  const input = useAppSelector(state => getPort(state, inputId))
  const output = useAppSelector(state => getPort(state, outputId))
  const setHover = useSetHover()
  const dispatch = useAppDispatch()

  function toggleConnection() {
    dispatch(toggle({
      input,
      output,
    }))
  }

  // console.count('ConnectionNode')

  return (
    <td
      id={ `port-intersection-${outputId}-${inputId}` }
      className={ classNames('connection-node', `port-type-${input.type}`, `input-port-id-${inputId}`, `output-port-id-${outputId}`) }
      onClick={ toggleConnection }
      onMouseEnter={ () => setHover?.({ input: inputId, output: outputId }) }
      onMouseLeave={ () => setHover?.(null) }
    >
      <SubdirectoryArrowRight />
    </td>
  )
})