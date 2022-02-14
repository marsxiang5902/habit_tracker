import { useContext } from "react"
import { Dropdown, DropdownButton } from "react-bootstrap"
import { appContext } from "../context/appContext"
import { getNumFormFields, getSomeEvents } from "../lib/locateEvents"

let EventSelect = (props) => {
    const context = useContext(appContext)
    const dropdownContents = getSomeEvents(context, ['habit'])
    const numFormFields = getNumFormFields(context)
    return(
      <DropdownButton variant="primary" title={props.title}>
            {Object.keys(dropdownContents).map(_id => (
                <Dropdown.Item name={props.idx} key={_id} onClick={(e) => { props.changeItem(false, _id, e)}}>{dropdownContents[_id].name}</Dropdown.Item>
            ))}
            {Object.keys(numFormFields).map((_id) => {
              return(
                <Dropdown.Item name={props.idx} key={_id} onClick={(e) => { props.changeItem(true, numFormFields[_id], e) }}>{_id}</Dropdown.Item>
              )
            })}
      </DropdownButton>
    )
}

export default EventSelect