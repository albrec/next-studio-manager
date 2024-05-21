import { PortTypes } from "@/lib/features/ports/portTypes"
import { useAppDispatch, useAppSelector } from "@/lib/hooks"
import classNames from "classnames"
import { memo, useContext, useEffect } from "react"
import { useSetHover } from "./ConnectionGrid"
import { toggle } from "@/lib/features/connections/connectionsSlice"
import { useSelector } from "react-redux"
import { getPort } from "@/lib/features/ports/portsSlice"

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

  console.count('ConnectionNode')
  return (
    <td
      id={ `port-intersection-${outputId}-${inputId}` }
      className={ classNames(`port-type-${input.type}`, `input-port-id-${inputId}`, `output-port-id-${outputId}`) }
      onClick={ toggleConnection }
      onMouseEnter={ () => setHover?.({ input: inputId, output: outputId }) }
      onMouseLeave={ () => setHover?.(null) }
    />
  )
})